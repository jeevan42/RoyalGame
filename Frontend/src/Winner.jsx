
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { marketplaceAddress } from './config';
import {Web3} from 'web3';
import $ from 'jquery'; 

import ABI from "./SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"


const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia-rpc.scroll.io/"));
var contractPublic = null;

async function getContract(userAddress) {
    contractPublic = await new web3.eth.Contract(ABI.abi,marketplaceAddress);
    console.log(contractPublic)
    if(userAddress != null && userAddress != undefined) {
      contractPublic.defaultAccount = userAddress;
    }
  }

function ChangeProposal(proposalId){
  localStorage.setItem("proposalId",proposalId);
  console.log(localStorage.getItem("proposalId"))
  window.location.href = "proposal";
}


  async function GetWinner() {


    var walletAddress = localStorage.getItem("filWalletAddress");
    await getContract(walletAddress);
    if(contractPublic != undefined) {
      var clubId = localStorage.getItem("clubId");
      var proposalId = localStorage.getItem("proposalId");
      var clubs = await contractPublic.methods.getGameMemberByClub(clubId).call();
      const ans  = await contractPublic.methods.isVotingOn(clubId,proposalId).call();
      if(clubs.length > 0) {

        if(!ans){
            
          
        clubs.forEach((valor, clave) => {
          const FinalPrice = valor.predictedPrice;          ;
          const UserPrice  = valor.FinalPrice;
          const currentuseradd = localStorage.getItem("filWalletAddress");
          const winneraddress = valor.creator;
          if((FinalPrice == UserPrice)&&(currentuseradd == winneraddress)){
            $('.card-body1').css('display','block');
            
            $('#proposal_status').text('WINNER');
          }
          else{
            
            $('#proposal_status').text('LOSS');
            $('.card-body1').css('display','none');
          }
        });
        return;
    }
    else{
      $('.card-body1').css('display','none');
        $('#proposal_status').text('PENDING');
        return;
    }
  }
  }
}
export default GetWinner;
