// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


library ClubLibrary {
    struct Club {
        uint256 id;
        string name;
        mapping(address => Member) members;
        uint256 memberCounter;
        uint256 pool;
         uint256 clubcreatedAt;
        uint256 clubexpireAt;
        mapping(uint256 => Proposal) proposals;
        mapping(uint256 =>GameMember) gamemembers;
        uint256 proposalCounter;
        string CID;
        string posdiverification;
        uint256 DealId;
        mapping(address => bool) contributions;
    }

    struct Member {
        address memberAddress;
        uint256 balance;
    }

    struct Proposal {
        uint256 id;
        address creator;
        uint256 amount;
        address destination;
        string status;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 proposedAt;
        uint256 proposalExpireAt;
        string Cid;
        string PieceCid;
        string carsize;
        string posdiverification;
        string storageProvider;
        uint256 DealId;
        mapping(address => bool) voted;
    }

     struct GameMember {
        uint256 clubId;
        address creator;
        address destination;
        uint256 proposedAt;
        uint256 proposalExpireAt;
         string status;
        uint256 priceFeed;
        uint256 predictedPrice;
        uint256 FinalPrice;
         uint256 RandomNumber;
    }
}

contract InvestmentClub {
     AggregatorV3Interface internal dataFeed;

    using ClubLibrary for ClubLibrary.Club;

    struct ClubInfo {
        uint256 clubId;
        string name;
        uint256 memberCount;
        uint256 proposalCount;
        uint256 pool;
        uint256 clubcreatedAt;
        uint256 clubexpireAt;
        string CID;
        string posdiverification;
        uint256 DealId;
    }
    struct GameMemberInfo {
        uint256 clubId;
        address creator;
        address destination;
        uint256 proposedAt;
        uint256 proposalExpireAt;
        string status;
        uint256 priceFeed;
         uint256 predictedPrice;
         uint256 FinalPrice;
         uint256 RandomNumber;
    }

    struct ProposalInfo {
        uint256 id;
        address creator;
        uint256 amount;
        address destination;
        string status;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 proposedAt;
        uint256 proposalExpireAt;
        string Cid;
        string PieceCid;
        string carsize;
        string posdiverification;
        string storageProvider;
        uint256 DealId;
    }

    struct Vote {
        address voter;
        bool inSupport;
    }

    struct ProposalVotes {
        uint256 id;
        Vote[] votes;
    }
// gMember.clubId,gMember.creator,gMember.priceFeed,gMember.predictedPrice
    event  Gamemember(
        uint256 clubId,address creator, uint256 priceFeed, uint256 predictedPrice
    );

    uint public LPrice;
    
    mapping(uint256 => ClubLibrary.Club) private clubs;
     mapping(address => bool) public contri;
    uint256 private clubCounter;
    uint256 private GameCounter;
     mapping(uint256 => ClubLibrary.GameMember) private Game;
    mapping(int => int) public LatestPrice;
    uint256 public EntryTime;


    constructor() {
         dataFeed = AggregatorV3Interface(
            0xaC3E04999aEfE44D508cB3f9B972b0Ecd07c1efb
        );
        clubCounter = 0;
        GameCounter =0;
    }

    // function getChainlinkDataFeedLatestAnswer() public  returns (int) {
    //     // prettier-ignore
    //     (
    //         /* uint80 roundID */,
    //         int answer,
    //         /*uint startedAt*/,
    //         /*uint timeStamp*/,
    //         /*uint80 answeredInRound*/
    //     ) = dataFeed.latestRoundData();
    //     LPrice = answer;
    //     return answer;
    // }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        
        return answer;
    }


    function StoredDatafeed(uint _price) public  {
        LPrice = _price;
    }

    function show() public view returns (uint){
        return LPrice;
    }

    // function fetchLatest(int clubId) public {
    //   LatestPrice[clubId] = LPrice ;
    // }


    function getClubById(uint256 clubId) public view returns (ClubInfo memory) {
        require(isClubIdExist(clubId), "the club does not exist");
        ClubLibrary.Club storage clubReal = clubs[clubId];
        ClubInfo memory club = ClubInfo(clubReal.id, clubReal.name, clubReal.memberCounter,clubReal.proposalCounter,clubReal.pool, clubReal.clubcreatedAt ,clubReal.clubexpireAt,clubReal.CID,clubReal.posdiverification, clubReal.DealId);
        return club;
    }

    function getMyClubs() public view returns (ClubInfo[] memory) {
        ClubInfo[] memory clubsInfo = new ClubInfo[](clubCounter);
        uint256 index = 0;
        for (uint256 i = 1; i <= clubCounter; i++) {
            ClubLibrary.Club storage club = clubs[i];
            if (isMemberOfClub(msg.sender, club.id)) {
                clubsInfo[index] = ClubInfo(club.id, club.name, club.memberCounter,club.proposalCounter, club.pool,club.clubcreatedAt,club.clubexpireAt,club.CID,club.posdiverification,club.DealId);
                index++;
            }
        }

        return clubsInfo;
    }
    
    function createClub(string memory name,string memory Cid) public  returns (uint256) {
        uint256 clubId = clubCounter + 1;
        ClubLibrary.Club storage club = clubs[clubId];
        club.id = clubId;
        club.name = name;
        club.pool = 0;
        club.proposalCounter = 0;
        club.memberCounter = 1;
        club.clubcreatedAt = block.timestamp;
        EntryTime = block.timestamp;
        club.clubexpireAt = block.timestamp + 3 minutes;
        club.CID = Cid;
        club.posdiverification="Pending";
        ClubLibrary.Member memory member = ClubLibrary.Member({
            memberAddress: msg.sender,
            balance: 0
        });

        

        
        club.members[msg.sender] = member;
        
        clubCounter = clubId;
        
        return clubId;
    }
    function verifiydocs(uint256 clubId) public{
        require(isClubIdExist(clubId), "The club does not exist");
        ClubLibrary.Club storage club = clubs[clubId];
        club.posdiverification="Verified";
    }
    
    function joinClub(uint256 clubId) public {
        require(isClubIdExist(clubId), "The club does not exist");
        ClubLibrary.Club storage club = clubs[clubId];
        require(isClubFull(clubId), "The club is full, no more members can be added");
        require(!isMemberOfClub(msg.sender, clubId), "You are already a member of the club");
        
        ClubLibrary.Member memory member = ClubLibrary.Member({
            memberAddress: msg.sender,
            balance: 0
        });
        
        club.members[msg.sender] = member;
        club.memberCounter += 1;
    }
    
    function contributeToClub(uint256 clubId) public payable {
        require(isClubIdExist(clubId), "the club does not exist");
        ClubLibrary.Club storage club = clubs[clubId];
        require(isMemberOfClub(msg.sender, clubId), "You are not a member of the club");
        require(msg.value > 0, "You must send EVMOS to contribute");

         require(isclubopen(clubId), "Club is closed");
        
        ClubLibrary.Member storage member = club.members[msg.sender];
        member.balance += uint256(msg.value);

       ClubLibrary.Member memory newMember = ClubLibrary.Member({
            memberAddress: msg.sender,
            balance: 0
        });
        club.contributions[msg.sender] = true; 

        
        club.members[msg.sender] = newMember;
        club.memberCounter += 1;
        
        club.pool += uint256(msg.value);
    }

    function checkContri(address _address) view public returns (bool) {
    return contri[_address];
}
 function checkContri(uint256 clubId, address _address) view public returns (bool) {
        return clubs[clubId].contributions[_address];
    }

    function FillGameMember(uint256 clubId,uint256 Price, address destination, uint256 PredictedPrice) public returns (uint256) {
        require(isClubIdExist(clubId), "the club does not exist");
        ClubLibrary.Club storage club = clubs[clubId];
        require(isMemberOfClub(msg.sender, clubId), "You are not a member of the club");
       uint256 proposalId = club.proposalCounter + 1;
        ClubLibrary.GameMember storage gMember = clubs[clubId].gamemembers[proposalId];
        gMember.clubId = proposalId;
        gMember.creator = msg.sender;
        gMember.destination= destination;
        gMember.proposedAt= block.timestamp;
        gMember.proposalExpireAt= EntryTime + 6 minutes;
        gMember.status="Pending";
        gMember.priceFeed = Price;
        gMember.predictedPrice = PredictedPrice;
         gMember.FinalPrice =0;
       gMember.RandomNumber=0;
       emit Gamemember(gMember.clubId,gMember.creator,gMember.priceFeed,gMember.predictedPrice);
       club.proposalCounter = proposalId;
      
       
        
        return clubId;
    }
    
    function createProposal(uint256 clubId, uint256 amount, address destination, string memory description,string memory Cid) public {
        require(isClubIdExist(clubId), "the club does not exist");
        
        ClubLibrary.Club storage club = clubs[clubId];
        require(isMemberOfClub(msg.sender, clubId), "You are not a member of the club");
        //require(club.pool >= amount, "The amount exceeds the pool of the club");
        require(amount > 0, "The amount of the proposal must be greater than 0");
         
        //require(getBalanceByClub(msg.sender, clubId), "Your balance in the club must be greater than 0");
        
        uint256 proposalId = club.proposalCounter + 1;
        ClubLibrary.Proposal storage proposal = clubs[clubId].proposals[proposalId];
        proposal.id = proposalId;
        proposal.creator = msg.sender;
        proposal.amount = amount;
        proposal.destination = destination;
        proposal.status = "Pending";
        proposal.description = description;
        proposal.votesFor = 0;
        proposal.votesAgainst = 0;
        proposal.proposedAt= block.timestamp;
        proposal.proposalExpireAt= block.timestamp + 5 minutes;
         proposal.Cid=Cid;
         proposal.PieceCid ="IN Process";
         proposal.carsize = "IN-Process";
         proposal.DealId =0;
         proposal.storageProvider="IN-Process";
         proposal.posdiverification="Un-Verified";

        club.proposalCounter = proposalId;
    }
    function proverifiydocs(uint256 clubId, uint256 proposalId) public{
        ClubLibrary.Proposal storage proposal = clubs[clubId].proposals[proposalId];
        proposal.posdiverification="Verified";
    }

    function getCarpiece(uint256 clubId,uint256 proposalId,string memory _Piece,string memory _carsize) public {
        ClubLibrary.Proposal storage proposal = clubs[clubId].proposals[proposalId];
        proposal.PieceCid=_Piece;
        proposal.carsize=_carsize;
    }

    function getdelandstorgae(uint256 clubId,uint256 proposalId,uint256 _dealId,string memory _storage) public {
        ClubLibrary.Proposal storage proposal = clubs[clubId].proposals[proposalId];
        proposal.DealId=_dealId;
        proposal.storageProvider=_storage;
    }

    function isclubopen(uint256 clubId) view public returns(bool) {
        ClubLibrary.Club storage club = clubs[clubId];
       return club.clubexpireAt > block.timestamp;
    }



    function isVotingOn(uint256 clubId,uint256 proposalId) view public returns(bool) {
        ClubLibrary.GameMember storage gMember = clubs[clubId].gamemembers[proposalId];
       return gMember.proposalExpireAt > block.timestamp;
    }

    function UpdateRandom(uint256 clubId,uint256 proposalId,uint256 newfeed,uint256 random)  public {
        ClubLibrary.GameMember storage gMember = clubs[clubId].gamemembers[proposalId];
       gMember.FinalPrice = newfeed;
       gMember.RandomNumber = random;
    }

    function isVotingOn1(uint256 clubId,uint256 proposalId) view public returns(bool) {
        ClubLibrary.Proposal storage proposal = clubs[clubId].proposals[proposalId];
       return proposal.proposalExpireAt > block.timestamp;
    }



    function voteOnProposal(uint256 clubId, uint256 proposalId, bool vote) public {
        require(isClubIdExist(clubId), "the club does not exist");
        require(isVotingOn(clubId,proposalId), "Voting Period Finished");
        
        ClubLibrary.Club storage club = clubs[clubId];
        require(isMemberOfClub(msg.sender, clubId), "You are not a member of the club");
        require(isProposalIdExist(proposalId, clubId), "The proposal does not exist");
        //require(getBalanceByClub(msg.sender, clubId) > 0, "Your balance in the club must be greater than 0");
        
        ClubLibrary.Proposal storage proposal = club.proposals[proposalId];
        require(!hasVoted(msg.sender, proposalId, clubId), "You have already voted on this proposal");
        require(keccak256(bytes(proposal.status)) == keccak256(bytes("Pending")), "The proposal is no longer pending");
        
        // proposal.voted[msg.sender] = vote;
        
        if (vote) {
            proposal.votesFor += 1;
        } else {
            proposal.votesAgainst += 1;
        }
    }

       function policyOK(uint256 clubId,uint256 proposalId) internal view returns (bool) {
        ClubLibrary.Proposal storage proposal = clubs[clubId].proposals[proposalId];
        //require(proposals[proposalID].proposalExpireAt > block.timestamp, "Voting in On");
        return proposal.votesFor > proposal.votesAgainst;
    }

    function executeProposal(uint256 clubId, uint256 proposalId) public payable {
        ClubLibrary.Club storage club = clubs[clubId];
        ClubLibrary.Proposal storage proposal = club.proposals[proposalId];
        require(isClubIdExist(clubId), "the club does not exist");
        require(isMemberOfClub(msg.sender, clubId), "You are not a member of the club");
        require(isProposalIdExist(proposalId, clubId), "The proposal does not exist");
        require(isValidExecutor(clubId, proposalId), "Only the creator of the proposal can execute it");
        require(club.pool >= proposal.amount, "The amount exceeds the pool of the club");
        require(proposal.votesFor > proposal.votesAgainst, "The proposal has not been approved");
        require(!isVotingOn(clubId,proposalId), "You can't before the Voting deadline");
        proposal.status = "Executed";
        club.pool -= proposal.amount;
        // payable(proposal.destination).transfer(uint256(proposal.amount));
        // This is to send to the winners when they womn
        payable(proposal.destination).transfer(uint256(proposal.amount));
    }

    function claimprize(uint256 clubId, uint256 proposalId) public payable {
        ClubLibrary.Club storage club = clubs[clubId];
        ClubLibrary.GameMember storage proposal = clubs[clubId].gamemembers[proposalId];
        require(isClubIdExist(clubId), "the club does not exist");
        require(isMemberOfClub(msg.sender, clubId), "You are not a member of the club");

        club.pool -= club.pool;
        // This is to send to the winners when they womn
        payable(proposal.destination).transfer(uint256(club.pool));
    }


    function closeProposal(uint256 clubId, uint256 proposalId) public {
        require(isClubIdExist(clubId), "the club does not exist");
        require(isProposalIdExist(proposalId, clubId), "The proposal does not exist");
        require(!isVotingOn(clubId,proposalId), "You can't before the Voting deadline");
        ClubLibrary.Proposal storage proposal = clubs[clubId].proposals[proposalId];
        require(keccak256(bytes(proposal.status)) == keccak256(bytes("Pending")), "The proposal is not in pending status");
        require(isValidExecutor(clubId, proposalId), "Only the proposal creator can close the proposal");
        
        proposal.status = "Closed";
    }

    function getGamememberById(uint256 clubId, uint256 proposalId) public view returns (GameMemberInfo memory) {
        require(isClubIdExist(clubId), "the club does not exist");
        require(isGamememberIdExist(proposalId, clubId), "The proposal does not exist");
        ClubLibrary.GameMember storage game = clubs[clubId].gamemembers[proposalId];
        GameMemberInfo memory proposalInfo = GameMemberInfo(
            game.clubId,
            game.creator,
            game.destination,
            game.proposedAt,
             game.proposalExpireAt,
            game.status,
            game.priceFeed,
            game.predictedPrice,
            game.FinalPrice,
            game.RandomNumber
        );
        return proposalInfo;
    }




    function getGameMemberByClub(uint256 clubId) public view returns (GameMemberInfo[] memory) {
        require(isClubIdExist(clubId), "Club does not exist");
        ClubLibrary.Club storage club = clubs[clubId];

        GameMemberInfo[] memory proposalList = new GameMemberInfo[](club.proposalCounter);
        uint256 index = 0;

        for (uint256 i = 1; i <= club.proposalCounter; i++) {
            ClubLibrary.GameMember storage proposal = club.gamemembers[i];
            proposalList[index] = GameMemberInfo(
                proposal.clubId,
            proposal.creator,
            proposal.destination,
            proposal.proposedAt,
             proposal.proposalExpireAt,
            proposal.status,
            proposal.priceFeed,
            proposal.predictedPrice,
            proposal.FinalPrice,
            proposal.RandomNumber

            );
            index++;
            
        }

        return proposalList;
    }
    


    function getProposalsByClub(uint256 clubId) public view returns (ProposalInfo[] memory) {
        require(isClubIdExist(clubId), "Club does not exist");
        ClubLibrary.Club storage club = clubs[clubId];

        ProposalInfo[] memory proposalList = new ProposalInfo[](club.proposalCounter);
        uint256 index = 0;

        for (uint256 i = 1; i <= club.proposalCounter; i++) {
            ClubLibrary.Proposal storage proposal = club.proposals[i];
            proposalList[index] = ProposalInfo(
                proposal.id,
                proposal.creator,
                proposal.amount,
                proposal.destination,
                proposal.status,
                proposal.description,
                proposal.votesFor,
                proposal.votesAgainst,
                proposal.proposedAt,
        proposal.proposalExpireAt,
        proposal.Cid,
        proposal.PieceCid,
        proposal.carsize,
        proposal.posdiverification,
        proposal.storageProvider,
        proposal.DealId
            );
            index++;
            
        }

        return proposalList;
    }

    function listClubs() public view returns (ClubInfo[] memory) {
        ClubInfo[] memory clubList = new ClubInfo[](clubCounter);

        for (uint256 i = 0; i < clubCounter; i++) {
            ClubLibrary.Club storage club = clubs[i+1];
            clubList[i] = ClubInfo(club.id, club.name, club.memberCounter,club.clubcreatedAt ,club.clubexpireAt, club.proposalCounter, club.pool,club.CID,club.posdiverification,club.DealId);
        }

        return clubList;
    }


    function leaveClub(uint256 clubId) public {
        require(isClubIdExist(clubId), "the club does not exist");
        ClubLibrary.Club storage club = clubs[clubId];
        require(isMemberOfClub(msg.sender, clubId), "You are not a member of the club");
        club.memberCounter -= 1;
        delete club.members[msg.sender];
    }

    function isValidExecutor(uint256 clubId, uint256 proposalId) private view returns (bool) {
        ClubLibrary.Club storage club = clubs[clubId];
        ClubLibrary.Proposal storage proposal = club.proposals[proposalId];
        return msg.sender == proposal.creator;
    }

    function getBalanceByClub(address userAddress, uint256 clubId) public view returns (uint256) {
        ClubLibrary.Club storage club = clubs[clubId];
        ClubLibrary.Member storage member = club.members[userAddress];
        return member.balance;
    }

    function isClubIdExist(uint256 clubId) public view returns (bool) {
        return clubs[clubId].id != 0;
    }

    function isMemberOfClub(address memberAddress, uint256 clubId) public view returns (bool) {
        return clubs[clubId].members[memberAddress].memberAddress != address(0);
    }

    function isProposalIdExist(uint256 proposalId, uint256 clubId) public view returns (bool) {
        return clubs[clubId].proposals[proposalId].id != 0;
    }
    
     function isGamememberIdExist(uint256 proposalId, uint256 clubId) public view returns (bool) {
        return clubs[clubId].gamemembers[proposalId].clubId != 0;
    }
    function hasVoted(address sender, uint256 proposalId, uint256 clubId) public view returns (bool) {
        return clubs[clubId].proposals[proposalId].voted[sender];
    }

    function isClubFull(uint256 clubId) public view returns (bool) {
        return (clubs[clubId].memberCounter < 99);
    }

}