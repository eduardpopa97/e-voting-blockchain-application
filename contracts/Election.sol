pragma solidity >0.6.0;
pragma experimental ABIEncoderV2;

contract Election
{
   address public owner; // Address of the account which was used to deploy contract
   
   uint candidateCount; // The number of candidates
   uint voterCount; // The number of voters
   uint pollsCount; // The number of polls

   // The structure of a candidate
   struct Candidate
   {
      string name;
      string url;
      uint voteCount;
      uint candidateId;
   }

   // Every poll has 2 candidates and a question (prompt)
   struct Poll
   {
      Candidate candidate1;
      Candidate candidate2;

      string prompt;

      // Bool values to state if election has started or not
      bool start;
      bool end;
   }

   /// DO NOT TOUCH
   // The structure of a voter
   struct Voter
   {
      address voterAddress;
      string name;
      string email;
      bool hasVoted;
      bool isVerified;
   }

   // Key-value mapping for candidates
   mapping(uint => Candidate) public candidateDetails;

   // Mapping of all the prompts
   mapping(uint => string) public pollsPrompts;


   // Details about every poll
   mapping(uint => Poll) public pollsDetails;


   /// DO NOT TOUCH
   // Array of address to store address of voters
   address[] public voters;

   // Mapping of address to Voter
   mapping(address => Voter) public voterDetails;


   // ###########################################################################################
   // FOR TESTING PURPOSES
   address[] public votersTest;

   mapping(address => Voter) public voterDetailsTest;

   uint voterCountTest; // The number of voters
   
   
   // Constructor (set default values to false or 0)
   constructor() public
   {
      owner = msg.sender;
      candidateCount = 0;
      voterCount = 0;
      pollsCount = 0;
      voterCountTest = 0;
   }

   // Function to return address of owner
   function getOwner() public view returns(address)
   {
      return owner;
   }

   // Modifier to allow only owner/admin to access
   modifier onlyAdmin()
   {
      require(msg.sender == owner);
      _;
   } 


   // Function to add a new poll, only by admin
   function addPoll(string memory _candidateName1, string memory _candidateName2, string memory _candidateURL1, string memory _candidateURL2, string memory prompt) public onlyAdmin
   {
      // Add the two candidates of a poll
      Candidate memory newCandidate1 = Candidate({
        name : _candidateName1,
        url : _candidateURL1,
        voteCount : 0,
        candidateId : candidateCount
      });

      // Insert it into the candidates array
      candidateDetails[candidateCount] = newCandidate1;

      candidateCount += 1;

      Candidate memory newCandidate2 = Candidate({
        name : _candidateName2,
        url : _candidateURL2,
        voteCount : 0,
        candidateId : candidateCount
      });

      candidateDetails[candidateCount] = newCandidate2;

      candidateCount += 1;      

      // Create a new poll with candidate details and the prompt
      Poll memory poll = Poll({
         candidate1 : newCandidate1,
         candidate2 : newCandidate2,
         prompt: prompt,
         start: false,
         end: false
      });

      pollsDetails[pollsCount] = poll;

      /////////////////////////////////////////////////////////
      // TODO: check if this is needed anymore
      pollsPrompts[pollsCount] = prompt;
      /////////////////////////////////////////////////////////

      pollsCount += 1;
      
   }

   function getCandidateDetails(uint candidateId) public view returns (string memory, string memory, uint, uint)
   {
      if (candidateCount > candidateId && 0 <= candidateId)
      {
         return (candidateDetails[candidateId].name,
                  candidateDetails[candidateId].url,
                  candidateDetails[candidateId].voteCount,
                  candidateDetails[candidateId].candidateId);
      }
   }

   // Get total number of candidates
   function getCandidateNumber() public view returns (uint)
   {
      return candidateCount;
   }
   
   // Get total number of polls
   function getPollsNumber() public view returns (uint)
   {
      return pollsCount;
   }   



   /// DO NOT TOUCH
   // Function to add as voter but will be verified by owner
   function requestVoter(string memory _name, string memory _email) public
   {
      Voter memory newVoter = Voter({
        voterAddress : msg.sender,
        name : _name,
        email: _email,
        hasVoted : false,
        isVerified : false
      });

      // Add a new voter to the internal array
      voterDetails[msg.sender] = newVoter;

      // Insert it to the array of voters (that voted)
      voters.push(msg.sender);

      // Increment the number of votes
      voterCount += 1;
   }

   // ###########################################################################################
   // FOR TESTING PURPOSES
   function requestVoterTest(address addressVoter, string memory _name, string memory _email) public
   {
      Voter memory newVoter = Voter({
        voterAddress : addressVoter,
        name : _name,
        email: _email,
        hasVoted : false,
        isVerified : false
      });

      // Add a new voter to the internal array
      voterDetailsTest[addressVoter] = newVoter;

      // Insert it to the array of voters (that voted)
      votersTest.push(addressVoter);

      // Increment the number of votes
      voterCountTest += 1;
   }

   function getVoterDetails(uint voterId) public view returns (address, string memory, string memory, bool, bool)
   {
      if (voterCount > voterId && 0 <= voterId)
      {
         address addr = voters[voterId];

         return (voterDetails[addr].voterAddress,
                  voterDetails[addr].name,
                  voterDetails[addr].email,
                  voterDetails[addr].hasVoted,
                  voterDetails[addr].isVerified);
      }
   }

   function getPollDetails(uint pollId) public view returns (uint, uint, string memory, bool, bool)
   {
      if (pollsCount > pollId && pollId >= 0)
      {
         return (pollsDetails[pollId].candidate1.candidateId,
                pollsDetails[pollId].candidate2.candidateId,
                pollsDetails[pollId].prompt,
                pollsDetails[pollId].start,
                pollsDetails[pollId].end);
      }
   }

   // ###########################################################################################
   // FOR TESTING PURPOSES
   function getVoterDetailsTest(address addr) public view returns (address, string memory, string memory, bool, bool)
   {
      for (uint voterIndex = 0; voterIndex < voterCountTest; voterIndex++) 
      {
         if (votersTest[voterIndex] == addr)
         {
            return (voterDetailsTest[addr].voterAddress,
               voterDetailsTest[addr].name,
               voterDetailsTest[addr].email,
               voterDetailsTest[addr].hasVoted,
               voterDetailsTest[addr].isVerified);
         }
      }
      
   }

   
   /// DO NOT TOUCH
   // Function to return number of voters
   function getVoterCount() public view returns (uint)
   {
      return voterCount;
   }

   // Make checks to see if the voter is verified
   function verifyVoter(address _address) public onlyAdmin
   {
      voterDetails[_address].isVerified = true;
   }


   /// DO NOT TOUCH
   // Function to vote a candidate, once you are verified as voter
   function vote(uint candidateId) public
   {
      // The consensus for voting as a typical voter
      require(voterDetails[msg.sender].hasVoted == false);
      require(voterDetails[msg.sender].isVerified == true);

      uint _pollIndex;
      for (_pollIndex = 0; _pollIndex < pollsCount; _pollIndex++)
      {
         if (pollsDetails[_pollIndex].candidate1.candidateId == candidateId)
         {
            if (pollsDetails[_pollIndex].start && !pollsDetails[_pollIndex].end)
            {
               pollsDetails[_pollIndex].candidate1.voteCount += 1;

               voterDetails[msg.sender].hasVoted = true;
            }          
         }
         else if(pollsDetails[_pollIndex].candidate2.candidateId == candidateId)
         {
            if (pollsDetails[_pollIndex].start && !pollsDetails[_pollIndex].end)
            {
               pollsDetails[_pollIndex].candidate2.voteCount += 1;

               voterDetails[msg.sender].hasVoted = true;
            }
         }
      }      
   }

   function voteAdmin(uint candidateId) public
   {
      // The consensus for voting as administrator
      require(voterDetails[msg.sender].hasVoted == false);

      uint _pollIndex;
      for (_pollIndex = 0; _pollIndex < pollsCount; _pollIndex++)
      {
         if (pollsDetails[_pollIndex].candidate1.candidateId == candidateId)
         {
            if (pollsDetails[_pollIndex].start && !pollsDetails[_pollIndex].end)
            {
               pollsDetails[_pollIndex].candidate1.voteCount += 1;

               voterDetails[msg.sender].hasVoted = true;
            }          
         }
         else if(pollsDetails[_pollIndex].candidate2.candidateId == candidateId)
         {
            if (pollsDetails[_pollIndex].start && !pollsDetails[_pollIndex].end)
            {
               pollsDetails[_pollIndex].candidate2.voteCount += 1;

               voterDetails[msg.sender].hasVoted = true;
            }
         }
      }      
   }




   // ###########################################################################################
   // FOR TESTING PURPOSES
   function getVoterCountTest() public view returns (uint)
   {
      return voterCountTest;
   }

   // Make checks to see if the voter is verified
   function verifyVoterTest(address _address) public onlyAdmin
   {
      voterDetailsTest[_address].isVerified = true;
   }

   // Function to vote a candidate, once you are verified as voter
   function voteTest(address voterAddress, uint candidateId) public
   {
      // The consensus for voting as a typical voter
      if (voterDetailsTest[voterAddress].hasVoted)
      {
         return;
      }
      if (!voterDetailsTest[voterAddress].isVerified)
      {
         return;
      }

      for (uint pollIndex = 0; pollIndex < pollsCount; pollIndex++)
      {
         for (uint candidateIndex = 0; candidateIndex < candidateCount; candidateIndex++)
         {
            if (pollsDetails[pollIndex].candidate1.candidateId == candidateDetails[candidateIndex].candidateId
                  && candidateDetails[candidateIndex].candidateId  == candidateId)
            {
               if (pollsDetails[pollIndex].start && !pollsDetails[pollIndex].end)
               {
                  candidateDetails[candidateIndex].voteCount += 1;
                  voterDetailsTest[voterAddress].hasVoted = true;
               }        
            }
            else if(pollsDetails[pollIndex].candidate2.candidateId == candidateDetails[candidateIndex].candidateId
                  && candidateDetails[candidateIndex].candidateId  == candidateId)
            {
               if (pollsDetails[pollIndex].start && !pollsDetails[pollIndex].end)
               {
                  candidateDetails[candidateIndex].voteCount += 1;
                  voterDetailsTest[voterAddress].hasVoted = true;
               }
            }
         }
      }
      
   }

   function voteAdminTest(address ownerAddr, uint candidateId) public
   {
      // The consensus for voting as administrator
      if (voterDetailsTest[ownerAddr].hasVoted)
      {
         return;
      }

      for (uint pollIndex = 0; pollIndex < pollsCount; pollIndex++)
      {
         for (uint candidateIndex = 0; candidateIndex < candidateCount; candidateIndex++)
         {
            if (pollsDetails[pollIndex].candidate1.candidateId == candidateDetails[candidateIndex].candidateId
                  && candidateDetails[candidateIndex].candidateId  == candidateId)
            {
               if (pollsDetails[pollIndex].start && !pollsDetails[pollIndex].end)
               {
                  candidateDetails[candidateIndex].voteCount += 1;
                  voterDetailsTest[ownerAddr].hasVoted = true;
               }        
            }
            else if (pollsDetails[pollIndex].candidate2.candidateId == candidateDetails[candidateIndex].candidateId
                  && candidateDetails[candidateIndex].candidateId  == candidateId)
            {
               if (pollsDetails[pollIndex].start && !pollsDetails[pollIndex].end)
               {
                  candidateDetails[candidateIndex].voteCount += 1;
                  voterDetailsTest[ownerAddr].hasVoted = true;
               }
            }
         }
      }
   }



   // Helper function to compare 2 strings
   // as memory and reference string cannot be compared in Soldity (thanks, Obama)
   function stringsEquals(string memory a, string memory b) private pure returns (bool)
   {
      return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
   }
   
   // CHECK TO SEE IF NEEDED TOUCH
   function startElection(string memory prompt) public onlyAdmin
   {
      uint _pollIndex;
      
      for (_pollIndex = 0; _pollIndex < pollsCount; _pollIndex++)
      {
         if (stringsEquals(pollsDetails[_pollIndex].prompt, prompt))
         {
            pollsDetails[_pollIndex].start = true;
            pollsDetails[_pollIndex].end = false;
         }
      }
   }

   function endElection(string memory prompt) public onlyAdmin
   {
      uint _pollIndex;
      
      for (_pollIndex = 0; _pollIndex < pollsCount; _pollIndex++)
      {
         if (stringsEquals(pollsDetails[_pollIndex].prompt, prompt))
         {
            pollsDetails[_pollIndex].end = true;
            pollsDetails[_pollIndex].start = false;
         }
      }
   }

   function getStart(string memory prompt) public view returns (bool)
   {
      uint _pollIndex;
      
      for (_pollIndex = 0; _pollIndex < pollsCount; _pollIndex++)
      {
         if (stringsEquals(pollsDetails[_pollIndex].prompt, prompt))
         {
            return pollsDetails[_pollIndex].start;
         }
      }
   }

   function getEnd(string memory prompt) public view returns (bool)
   {
      uint _pollIndex;
      
      for (_pollIndex = 0; _pollIndex < pollsCount; _pollIndex++)
      {
         if (stringsEquals(pollsDetails[_pollIndex].prompt, prompt))
         {
            return pollsDetails[_pollIndex].end;
         }
      }
   }
}