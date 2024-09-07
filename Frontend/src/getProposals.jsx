
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

// window.ChangeProposal=(proposalId)=> {
//     localStorage.setItem("proposalId",proposalId);
//     console.log(localStorage.getItem("proposalId"))
//   //   const history = useHistory();
//   // history.push("/proposal");
//   window.location.href = "proposal";
//   }


function ChangeProposal(proposalId){
  localStorage.setItem("proposalId",proposalId);
  console.log(localStorage.getItem("proposalId"))
  window.location.href = "proposal";
}


  async function GetProposals() {


   
    var walletAddress = localStorage.getItem("filWalletAddress");
    await getContract(walletAddress);
    if(contractPublic != undefined) {
      var clubId = localStorage.getItem("clubId");
      var clubs = await contractPublic.methods.getGameMemberByClub(clubId).call();

      console.log("The get club is ",clubs)

      if(clubs.length > 0) {
  
        var list = document.querySelector('.available_proposals');
          var table = document.createElement('table');
          var thead = document.createElement('thead');
          var tbody = document.createElement('tbody');
  
          var theadTr = document.createElement('tr');
          var balanceHeader = document.createElement('th');
          balanceHeader.innerHTML = 'ID';
          theadTr.appendChild(balanceHeader);
          var contractNameHeader = document.createElement('th');
          contractNameHeader.innerHTML = 'User';
          theadTr.appendChild(contractNameHeader);
          var contractTickerHeader = document.createElement('th');
          contractTickerHeader.innerHTML = 'User Price (LINK/USD)';
          theadTr.appendChild(contractTickerHeader);
          
  
          var usdHeader2 = document.createElement('th');
          usdHeader2.innerHTML = 'Proposal Status (Closed In)';
          theadTr.appendChild(usdHeader2);

          
  
          thead.appendChild(theadTr)
  
          table.className = 'table';
          table.appendChild(thead);
  
        clubs.forEach((valor, clave) => {
          var tbodyTr = document.createElement('tr');
          var contractTd = document.createElement('td');
          var clubLink = document.createElement('a');
          clubLink.className = 'btn btn-success';
          clubLink.textContent = valor.clubId;
          clubLink.addEventListener('click', function() {
            ChangeProposal(valor.clubId);
          });

          contractTd.innerHTML = "<div class='btn btn-success' onclick='ChangeProposal(" + valor.clubId + ")'>"+valor.clubId+"</div>";
          tbodyTr.appendChild(clubLink);
          var contractTickerTd = document.createElement('td');
          contractTickerTd.innerHTML = '<b>' + valor.creator + '</b>';
          tbodyTr.appendChild(contractTickerTd);
          var balanceTd = document.createElement('td');
          // web3.utils.toWei(proposal_amount.toString(), 'ether');
          balanceTd.innerHTML = '<b>' + web3.utils.fromWei(valor.predictedPrice.toString(),'ether')  + '</b>';
          tbodyTr.appendChild(balanceTd);
          var balanceUSDTd2 = document.createElement('td');
          balanceUSDTd2.innerHTML = '<b>' +new Date(Number(valor.proposalExpireAt ) * 1000).toLocaleString()+ '</b>';
          tbodyTr.appendChild(balanceUSDTd2);
         
          tbody.appendChild(tbodyTr);
        });
  
        table.appendChild(tbody);
  
          list.appendChild(table);
      }
      $('.loading_message').css('display','none');
    }
  }

export default GetProposals;
