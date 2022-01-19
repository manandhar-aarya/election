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

    constructor(){
        admin = msg.sender;
    }

    function createElection(string memory electionName, string[] memory candidateNameList, uint numberOfTokens) public restricted {
        address newElection = address(new Election(electionName, candidateNameList, admin));
        DeployedElection memory elect = DeployedElection({
        name : electionName,
        electionAddress : newElection
        });
        deployedElections.push(elect);
        mintTokens(numberOfTokens);
    }

    function mintTokens(uint numberOfTokens) public restricted {

    }

    modifier restricted() {
        require(msg.sender == admin, "Only the admin can access this function");
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
