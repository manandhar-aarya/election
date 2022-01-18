// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title ElectionFactory
 * @dev Implements creation of multiple elections
 */
contract ElectionFactory {
    address[] public deployedElections;
    address public admin;

    function createElection(bytes32[] memory candidateNameList, uint totalVoters) public {
        admin = msg.sender;
        address newElection = address(new Election(candidateNameList, totalVoters, admin));
        deployedElections.push(newElection);
    }

    function getDeployedElections() public view returns (address[] memory) {
        return deployedElections;
    }
}

/**
 * @title Election
 * @dev Implements voting process
 */
contract Election {

    struct Candidate {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public admin;
    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidateList;

    uint public voterCount;
    uint public totalVoterCount;
    uint public candidateCount;

    /**
     * @dev Create a new ballot to choose one of 'candidateNameList'.
     * @param candidateNameList names of candidateList
     */
    constructor(bytes32[] memory candidateNameList, uint totalVoters, address adminAddress) {
        admin = adminAddress;
        totalVoterCount = totalVoters;
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
    function winnerName() public view returns (bytes32 winnerName_){
        winnerName_ = candidateList[winningCandidate()].name;
    }
}
