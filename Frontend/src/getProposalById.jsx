
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import $ from 'jquery'; 

import { marketplaceAddress } from "./config";
import {Web3} from 'web3';

import ABI from "./SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"

const ethers = require("ethers")
const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia-rpc.scroll.io/"));
var contractPublic = null;

var pieceCID = null;
var carsize = null;

async function getContract(userAddress) {
    contractPublic = await new web3.eth.Contract(ABI.abi,marketplaceAddress);
    console.log(contractPublic)
    if(userAddress != null && userAddress != undefined) {
      contractPublic.defaultAccount = userAddress;
    }
  }

  const clubId =  localStorage.getItem("clubId");
  var proposalId = localStorage.getItem("proposalId");



async function getProposalById(){




var clubId = localStorage.getItem("clubId");
    var proposalId = localStorage.getItem("proposalId");

  var filWalletAddress = localStorage.getItem("filWalletAddress");
  await getContract(filWalletAddress);
  if(contractPublic != undefined) {
    var aeWalletAddress = localStorage.getItem("filWalletAddress");


    
    
    var clubs = await contractPublic.methods.getGamememberById(clubId, proposalId).call();



    console.log("My prposals",clubs)

     
    if(clubs != undefined) {

      // console.log(clubs.Cid,clubs.PieceCid,clubs.carsize,clubs.posdiverification,clubs.storageProvider,clubs.DealId)

      localStorage.setItem("AddressbyId",clubs.destination);

      const Final = localStorage.getItem("Final");
      $('#my_votes').text(Final);
      $('.proposal_description').text(clubs.description);
      $('#proposal_creator').text(clubs.creator);
      $('#proposal_destination').text(clubs.destination);
      // web3.utils.toWei(proposal_amount.toString(), 'ether');
      $('#proposal_amount').text(web3.utils.fromWei(clubs.predictedPrice
        .toString(), 'ether'));
      $('#votes_for').text(clubs.votesFor);
      $('#votes_against').text(clubs.votesAgainst);
      $('#CID').text(clubs.priceFeed);
      
      if(clubs.status == 'Pending' && clubs.creator == filWalletAddress) {
        $('.creator_options').css('display','block');
      }
      if(clubs.status != 'Pending') {
        $('.votes_available').css('display','none');
      }
      
      $('#proposalExpireAt').text(new Date(Number(clubs.proposalExpireAt) * 1000).toLocaleString());
      $('#proposedAt').text(new Date(Number(clubs.proposedAt) * 1000).toLocaleString());

      var list = document.querySelector('.my_votes');
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        var theadTr = document.createElement('tr');
        var balanceHeader = document.createElement('th');
        balanceHeader.innerHTML = 'Voter';
        theadTr.appendChild(balanceHeader);
        var usdHeader2 = document.createElement('th');
        usdHeader2.innerHTML = 'Option';
        theadTr.appendChild(usdHeader2);

        thead.appendChild(theadTr)

        table.className = 'table';
        table.appendChild(thead);

    }
    $('.loading_message').css('display','none');
  }
}
export default getProposalById; 