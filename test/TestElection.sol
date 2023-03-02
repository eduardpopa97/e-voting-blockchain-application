pragma solidity >=0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Election.sol";

// Check slide 9 from PPT

contract TestElection {

  // Election election = Election(DeployedAddresses.Election()); // either get the currently deployed contract
  Election election = new Election(); // or create a new instance of the contract - suggested

  /// Verify adding candidates - 1
  function testItCreatesAPollCorrectly() public
  {    
    election.addPoll("Bidila Timotei", "Eduard Popa", "picture1.url", "picture2.url", "Who will lead the project?");

    uint expectedCandidatesCount = 2;

    Assert.equal(election.getCandidateNumber(), expectedCandidatesCount, "It should contain 2 candidates.");


    // Candidate 1 details
    string memory candidate1Name;
    string memory candidate1URL;
    uint candidate1VoteCount;
    uint candidate1ID;

    (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(0);

    // Candidate 2 details
    string memory candidate2Name;
    string memory candidate2URL;
    uint candidate2VoteCount;
    uint candidate2ID;

    (candidate2Name, candidate2URL, candidate2VoteCount, candidate2ID) = election.getCandidateDetails(1);

    uint expectedPollsCount = 1;


    Assert.equal(election.getPollsNumber(), expectedPollsCount, "It should contain 1 poll.");

    Assert.isNotZero(bytes(candidate1Name).length, "First candidate\'s name is not zero");
    Assert.isNotZero(bytes(candidate2Name).length, "Second candidate\'s name is not zero");

  }


  /// Verify attributes values when initializing - 2
  function testItAddsCorrectCandidateDetails() public
  {
    string memory expectedCandidate1Name = "Bidila Timotei";
    string memory expectedcandidate2Name = "Eduard Popa";

    uint expectedCandidate1VoteCount = 0;
    uint expectedCandidate2VoteCount = 0;

    uint expectedCandidate1ID = 0;
    uint expectedCandidate2ID = 1;

    // Candidate 1 details
    string memory candidate1Name;
    string memory candidate1URL;
    uint candidate1VoteCount;
    uint candidate1ID;

    (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(0);

    // Candidate 2 details
    string memory candidate2Name;
    string memory candidate2URL;
    uint candidate2VoteCount;
    uint candidate2ID;

    (candidate2Name, candidate2URL, candidate2VoteCount, candidate2ID) = election.getCandidateDetails(1);

    Assert.equal(candidate1Name, expectedCandidate1Name, "It should have the same candidate name.");

    Assert.equal(candidate1ID, expectedCandidate1ID, "It should have an incrementing id");

    Assert.equal(candidate1VoteCount, expectedCandidate1VoteCount, "It should have 0 votes");


    Assert.equal(candidate2Name, expectedcandidate2Name, "It should have the same candidate name.");

    Assert.equal(candidate2ID, expectedCandidate2ID, "It should have an incrementing id");

    Assert.equal(candidate2VoteCount, expectedCandidate2VoteCount, "It should have 0 votes");
  }

  // Not yet working
  // function testItAddsCorrectPollDetails() public
  // {
  //   uint retrievedCandidate1ID;
  //   uint retrievedCandidate2ID;

  //   string memory prompt;

  //   bool start;
  //   bool end;

  //   string memory candidate1Name;
  //   string memory candidate1URL;
  //   uint candidate1VoteCount;
  //   uint candidate1ID;


  //   string memory candidate2Name;
  //   string memory candidate2URL;
  //   uint candidate2VoteCount;
  //   uint candidate2ID;

  //   // Not working here: 
  //   (retrievedCandidate1ID, retrievedCandidate2ID, prompt, start, end) = election.getPollDetails(0);


  //   // Retrieve candidate details
  //   (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(retrievedCandidate1ID);

  //   (candidate2Name, candidate2URL, candidate2VoteCount, candidate2ID) = election.getCandidateDetails(retrievedCandidate2ID);


  //   Assert.equal(candidate1Name, "Bidila Timotei", "It should have the same candidate name.");

  //   Assert.equal(candidate1ID, 0, "It should have an incrementing id");

  //   Assert.equal(candidate1VoteCount, 0, "It should have 0 votes");


  //   Assert.equal(candidate2Name, "Eduard Popa", "It should have the same candidate name.");

  //   Assert.equal(candidate2ID, 1, "It should have an incrementing id");

  //   Assert.equal(candidate2VoteCount, 0, "It should have 0 votes");


  //   Assert.equal(prompt, "Who will lead the project?", "It should contain the right poll prompt");
    
  // }


  // Verify a poll is active / inactive - 7
  function testItStartsAPollCorrectly() public
  {
    bool expectedPollStatusActive = true;
    bool expectedPollStatusInactive = true;


    election.startElection("Who will lead the project?");    

    Assert.equal(election.getStart("Who will lead the project?"), expectedPollStatusActive, "It should have started the poll");

    Assert.equal(election.getEnd("Who will lead the project?"), false, "It should have the poll still active");

    
    
    election.endElection("Who will lead the project?");    

    Assert.equal(election.getEnd("Who will lead the project?"), expectedPollStatusInactive, "It should have ended the poll");

    Assert.equal(election.getStart("Who will lead the project?"), false, "It should have still ended the poll");


    // Start the election again to be able to pass the following tests
    election.startElection("Who will lead the project?");
  }


  // Verify voting from admin - 3 + 4
  function testItCastsAVoteCorrectlyFromAdmin() public
  {
    address adminAddr = 0xAbC008905b95A2784c67D8a5E99eD2575AfffAf8;

    election.requestVoterTest(adminAddr, "Admin", "admin@test.com");

    Assert.equal(election.getVoterCountTest(), 1, "It should have added the admin!");

    // Get admin voting details
    address voterAddress;
    string memory voterName;
    string memory voterEmail;
    bool voterHasVoted;
    bool voterIsVerified;

    (voterAddress, voterName, voterEmail, voterHasVoted, voterIsVerified) = election.getVoterDetailsTest(adminAddr);

    Assert.equal(voterAddress, adminAddr, "It should be the same address stored!");

    Assert.equal(voterHasVoted, false, "The admin should not have voted yet!");

    election.voteAdminTest(adminAddr, 0);

    (voterAddress, voterName, voterEmail, voterHasVoted, voterIsVerified) = election.getVoterDetailsTest(adminAddr);

    Assert.equal(voterHasVoted, true, "The admin should have voted!");

    // Candidate 1 details
    string memory candidate1Name;
    string memory candidate1URL;
    uint candidate1VoteCount;
    uint candidate1ID;

    (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(0);

    uint expectedCandidate1VoteCount = 1;

    Assert.equal(candidate1VoteCount, expectedCandidate1VoteCount, "It should have 1 vote");


    // Candidate 2 details
    string memory candidate2Name;
    string memory candidate2URL;
    uint candidate2VoteCount;
    uint candidate2ID;

    (candidate2Name, candidate2URL, candidate2VoteCount, candidate2ID) = election.getCandidateDetails(1);

    uint expectedCandidate2VoteCount = 0;

     Assert.equal(candidate2VoteCount, expectedCandidate2VoteCount, "It should have 0 votes");
  }

  // Verify voting from normal voter - 3 + 4
  function testItCastsAVoteCorrectlyFromVoter() public
  {
    address voter1addr = 0xabC008905B95A2784c67D8A5E99ED2571AffFA12;

    election.requestVoterTest(voter1addr, "Voter1", "voter1@test.com");

    // Voter details
    address voterAddress;
    string memory voterName;
    string memory voterEmail;
    bool voterHasVoted;
    bool voterIsVerified;

    (voterAddress, voterName, voterEmail, voterHasVoted, voterIsVerified) = election.getVoterDetailsTest(voter1addr);

    election.verifyVoterTest(voter1addr);

    election.voteTest(voter1addr, 1);

    (voterAddress, voterName, voterEmail, voterHasVoted, voterIsVerified) = election.getVoterDetailsTest(voter1addr);

    Assert.equal(voterHasVoted, true, "It should have marked the voter as voted");

    // Candidate 1 details
    string memory candidate1Name;
    string memory candidate1URL;
    uint candidate1VoteCount;
    uint candidate1ID;

    (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(0);

    uint expectedCandidate2VoteCount = 1;

    Assert.equal(candidate1VoteCount, expectedCandidate2VoteCount, "It should have 1 vote");


    // Candidate 2 details
    string memory candidate2Name;
    string memory candidate2URL;
    uint candidate2VoteCount;
    uint candidate2ID;

    (candidate2Name, candidate2URL, candidate2VoteCount, candidate2ID) = election.getCandidateDetails(1);

    uint expectedCandidate1VoteCount = 1;

    Assert.equal(candidate2VoteCount, expectedCandidate1VoteCount, "It should have 1 vote");
  }



  // Test if non-existent candidate gets a vote - 5
  function testItDoesNotAllowVotesForNonExistentCandidates() public
  {
    uint candidateId = 15;

    address voter2addr = 0xAbc008905b95a2784c67d8a5e99Ed2571AFfFa34;

    election.requestVoterTest(voter2addr, "Voter2", "voter2@test.com");

    // Voter details
    address voterAddress;
    string memory voterName;
    string memory voterEmail;
    bool voterHasVoted;
    bool voterIsVerified;

    (voterAddress, voterName, voterEmail, voterHasVoted, voterIsVerified) = election.getVoterDetailsTest(voter2addr);

    election.verifyVoterTest(voter2addr);

    election.voteTest(voter2addr, candidateId);

    // Candidate 1 details
    string memory candidate1Name;
    string memory candidate1URL;
    uint candidate1VoteCount;
    uint candidate1ID;

    (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(0);

    uint expectedCandidate2VoteCount = 1;

    Assert.equal(candidate1VoteCount, expectedCandidate2VoteCount, "It should have 1 vote");


    // Candidate 2 details
    string memory candidate2Name;
    string memory candidate2URL;
    uint candidate2VoteCount;
    uint candidate2ID;

    (candidate2Name, candidate2URL, candidate2VoteCount, candidate2ID) = election.getCandidateDetails(1);

    uint expectedCandidate1VoteCount = 1;

    Assert.equal(candidate2VoteCount, expectedCandidate1VoteCount, "It should have 1 vote");
  }



  // Test if double voting is prohibited - 6
  function testItDoesNotAllowDoubleVoting() public
  {
    uint candidateId = 0;

    address voter3addr = 0xaBc008905B95A2784c67d8A5E99ed2571aFffa56;

    election.requestVoterTest(voter3addr, "Voter3", "voter3@test.com");

    // Voter details
    address voterAddress;
    string memory voterName;
    string memory voterEmail;
    bool voterHasVoted;
    bool voterIsVerified;

    uint expectedCandidate1VoteCount = 2;

    (voterAddress, voterName, voterEmail, voterHasVoted, voterIsVerified) = election.getVoterDetailsTest(voter3addr);

    election.verifyVoterTest(voter3addr);


    election.voteTest(voter3addr, candidateId);


     // Candidate 1 details
    string memory candidate1Name;
    string memory candidate1URL;
    uint candidate1VoteCount;
    uint candidate1ID;

    (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(0);


    Assert.equal(candidate1VoteCount, expectedCandidate1VoteCount, "It should have 2 votes after voting first time");
    
    // Test double voting a candidate
    election.voteTest(voter3addr, candidateId);


    (candidate1Name, candidate1URL, candidate1VoteCount, candidate1ID) = election.getCandidateDetails(0);
    
    Assert.equal(candidate1VoteCount, expectedCandidate1VoteCount, "It should still have 2 votes");


    // Candidate 2 details
    string memory candidate2Name;
    string memory candidate2URL;
    uint candidate2VoteCount;
    uint candidate2ID;

    (candidate2Name, candidate2URL, candidate2VoteCount, candidate2ID) = election.getCandidateDetails(1);

    uint expectedCandidate2VoteCount = 1;

    Assert.equal(candidate2VoteCount, expectedCandidate2VoteCount, "It should have 1 vote");
  }

}
