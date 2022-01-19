// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title ElectionFactory
 * @dev Implements creation of multiple elections
 */
contract ElectionFactory {
    struct DeployedElection {
        string name;
        address electionAddress;
    }

    DeployedElection[] public deployedElections;
    address public admin;
    address tokenAddress;
    address public vendorAddress;
    Vendor vendor;

    constructor(){
        admin = msg.sender;
        tokenAddress = address(new IVotedToken(admin));
        vendor = new Vendor(tokenAddress, admin);
        vendorAddress = address(vendor);
    }

    function createElection(string memory electionName, string[] memory candidateNameList, uint numberOfTokens) public restricted payable {
        address newElection = address(new Election(electionName, candidateNameList, admin));
        DeployedElection memory elect = DeployedElection({
        name : electionName,
        electionAddress : newElection
        });
        deployedElections.push(elect);
        (bool mint) = vendor.mintTokens{value : msg.value}(numberOfTokens, msg.sender);
        require(mint, "Failed to mint tokens");

    }

    modifier restricted() {
        require(msg.sender == admin, "Only the admin can access create election");
        _;
    }

    function getDeployedElections() public view returns (DeployedElection[] memory) {
        return deployedElections;
    }
}

/**
 * @title Election
 * @dev Implements voting process
 */
contract Election {
    struct Candidate {
        string name;
        uint voteCount; // number of accumulated votes
    }

    address public admin;
    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidateList;
    uint public voterCount;
    uint public candidateCount;
    string public name;

    /**
     * @dev Create a new ballot to choose one of 'candidateNameList'.
     * @param candidateNameList names of candidateList
     */
    constructor(string memory electionName, string[] memory candidateNameList, address adminAddress) {
        name = electionName;
        admin = adminAddress;
        for (uint i = 0; i < candidateNameList.length; i++) {
            candidateList[i] = Candidate({
            name : candidateNameList[i],
            voteCount : 0
            });
        }
        candidateCount = candidateNameList.length;
    }

    /**
     * @dev Give your vote (including votes delegated to you) to candidateIndex 'candidateList[candidateIndex].name'.
     * @param candidateIndex index of candidateIndex in the candidateList array
     */
    function vote(uint candidateIndex) public {
        require(!voters[msg.sender], "Already voted.");
        voters[msg.sender] = true;
        voterCount++;
        candidateList[candidateIndex].voteCount ++;
    }

    /**
     * @dev Computes the winning candidateIndex taking all previous votes into account.
     * @return winningProposal_ index of winning candidateIndex in the candidateList array
     */
    function winningCandidate() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < candidateCount; p++) {
            if (candidateList[p].voteCount > winningVoteCount) {
                winningVoteCount = candidateList[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /**
     * @dev Calls winningCandidate() function to get the index of the winner contained in the candidateList array and then
     * @return winnerName_ the name of the winner
     */
    function winnerName() public view returns (string memory winnerName_){
        winnerName_ = candidateList[winningCandidate()].name;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract IVotedToken is IERC20 {
    address public admin;
    string public constant name = "iVoted Token";
    string public constant symbol = "VTE";
    uint8 public constant decimals = 18;

    mapping(address => uint256) balances;

    uint256 totalSupply_;

    using SafeMath for uint256;


    constructor(address adminAddress) {
        admin = adminAddress;
    }

    modifier restricted() {
        require(msg.sender == admin, "Only the admin can mint token of ivoted");
        _;
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        return true;
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        balances[owner] = balances[owner].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        return true;
    }

    function mintTokens(uint256 amount, address account, address sender) public returns (bool){
        require(sender == admin, "Only the admin can mint token of vendor");
        totalSupply_ += amount;
        balances[account] = balances[account] += amount;
        return true;
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}


contract Vendor {
    address public admin;

    // Token Contract
    IVotedToken token;

    // token price for ETH
    uint256 public tokensPerEth = 100;

    constructor(address tokenAddress, address adminAddress) payable {
        admin = adminAddress;
        token = IVotedToken(tokenAddress);
    }

    function mintTokens(uint256 numberOfTokens, address sender) public payable returns (bool) {
        require(sender == admin, "Only the admin can mint token of vendor");

        require(msg.value > 0, "Send ETH to mint tokens");

        require(msg.value >= numberOfTokens / tokensPerEth, "Sent ETH not enough to buy tokens");

        (bool mint) = token.mintTokens(numberOfTokens, address(this), sender);
        require(mint, "Failed to mint tokens");
        return true;
    }


    /**
    * @dev Allow users to buy token for ETH
    */
    function buyTokens() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "Send ETH to buy some tokens");

        uint256 amountToBuy = msg.value * tokensPerEth;

        // check if the Vendor Contract has enough amount of tokens for the transaction
        uint256 vendorBalance = token.balanceOf(address(this));
        require(vendorBalance >= amountToBuy, "Vendor contract has not enough tokens in its balance");

        // Transfer token to the msg.sender
        (bool sent) = token.transfer(msg.sender, amountToBuy);
        require(sent, "Failed to transfer token to user");

        return amountToBuy;
    }

    /**
    * @dev Allow users to sell tokens for ETH
    */
    function sellTokens(uint256 numberOfTokens) public {
        require(token.balanceOf(msg.sender) >= numberOfTokens, "User does not have enough tokens to sell");

        uint256 ethAmount = numberOfTokens / tokensPerEth;
        uint256 vendorBalance = address(this).balance;
        require(vendorBalance >= ethAmount, "Vendor contract does not have enough balance");

        // deduct tokens from user's balance
        (bool sent) = token.transfer(address(this), numberOfTokens);
        require(sent, "Failed to transfer token to contract");

        // transfer ETH to the user
        payable(msg.sender).transfer(ethAmount);
    }

    /**
    * @dev Allow the admin of the contract to withdraw ETH
    */
    function withdraw(address sender) public {
        require(sender == admin, "Only the admin can mint token of vendor");
        uint256 ownerBalance = address(this).balance;
        require(ownerBalance > 0, "Owner has not balance to withdraw");

        (bool sent,) = msg.sender.call{value : address(this).balance}("");
        require(sent, "Failed to send user balance back to the owner");
    }
}