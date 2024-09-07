import React from 'react'
import { marketplaceAddress } from './config';
import {Web3} from 'web3';
import $ from 'jquery'; 
import ABI from "./SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"

import {ethers} from 'ethers';
import { UseAlchemy } from './components/Hooks/Connection';
const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia-rpc.scroll.io/"));
var contractPublic = null;

async function getContract(userAddress) {
    contractPublic =  new web3.eth.Contract(ABI.abi,marketplaceAddress);
    console.log(contractPublic)
    if(userAddress != null && userAddress != undefined) {
      contractPublic.defaultAccount = userAddress;
    }
  }


async function GetClub() {

    var clubId = localStorage.getItem("clubId");
    // alert(clubId)
    var walletAddress = localStorage.getItem("filWalletAddress");
    await getContract(walletAddress);
    try {
      // alert(clubId)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
      const signer = provider.getSigner();
      var club = await contractPublic.methods.getClubById(clubId).call();
  
      let contract = new ethers.Contract(
        marketplaceAddress,
        ABI.abi,
        signer
      );

      var price = await contract.LPrice();

      const decimal_number1 = parseInt(price, 16);
      let numberAsString = price.toString();

      

   
      

// Remove the last 6 characters
let trimmedNumberString = numberAsString.slice(0, -4);

localStorage.setItem("feed",trimmedNumberString)


              console.log("The price fetched is",trimmedNumberString);

      console.log("The price is",trimmedNumberString)

      console.log(club)
      if (club != null) {
        // Update UI elements
        // alert(club.name)
        $('.club_name').text(club.name);
        $('#club_id').text(club.id);
        $('.club_members').text(club.memberCount);
        $('.club_proposals').text(club.proposalCount
        )
        $('.Datafeed').text(trimmedNumberString);
        // alert(club.pool)
        const poolBalanceWei = club.pool;
        const poolBalanceEther = web3.utils.fromWei(poolBalanceWei.toString(), 'ether');
    $('.club_balance').text(poolBalanceEther);
        // $('.club_balance').text(web3.utils.fromWei(club.pool));
      }
    } catch (error) {
      // alert(error)
      console.error("Error fetching club data:", error);
    }
  
  
    // if(clubId != null) {
    //   await getContract();
      
    //   if(contractPublic != undefined) {
    //     var club = await contractPublic.methods.getClubById(clubId).call();
    //     alert(club)
    //     alert(club.name)
    //     if(club != null) {
    //       $('.club_name').text(club.name);
    //       $('#club_id').text(club.id);
    //       $('.club_members').text(club.memberCount);
    //       $('.club_proposals').text(club.proposalCount);
    //       $('.club_balance').text(web3.utils.fromWei(club.pool));
    //     }
    //   }
    // }
  }
  


export default GetClub