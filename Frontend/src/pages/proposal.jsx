
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import $, { error } from 'jquery'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CovalentClient } from "@covalenthq/client-sdk";
import { marketplaceAddress } from "../config";
import {Web3} from 'web3';
import GetWinner from "../Winner";
import ABI from "../SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"
import Swap from "./swap";
import Price from "./Price";
import axios from 'axios';
import getProposalById from '../getProposalById';
import GetClub from '../getclub';
import Tg from "../components/toggle";
import { UseAlchemy } from '../components/Hooks/Connection';
import { notification } from 'antd';
const ethers = require("ethers")
const DataDaoAddress  = "0x8138489b863a68f224307a5D0Fa630917d848e25"
const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia-rpc.scroll.io/"));

var contractPublic = null;

var datacontractinstance = null;


async function getContract(userAddress) {
    contractPublic = await new web3.eth.Contract(ABI.abi,marketplaceAddress);
    console.log(contractPublic)
    if(userAddress != null && userAddress != undefined) {
      contractPublic.defaultAccount = userAddress;
    }
  }

  var DealId = null;
  var clubId = localStorage.getItem("clubId");
  var proposalId = localStorage.getItem("proposalId");




async function verify(){
  const clubId =  localStorage.getItem("clubId");
  var proposalId = localStorage.getItem("proposalId");
  var clubs = await contractPublic.methods.getProposalsByClub(clubId).call();
  console.log(clubs)
  const cid= clubs[proposalId-1].Cid;

  const polygonScanlink = `https://gateway.lighthouse.storage/ipfs/${cid}`
            toast.success(<a target="_blank" href={polygonScanlink}>Click to view Data</a>, {
              position: "top-right",
              autoClose: 18000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
        

}



async function verifyUserInClub() {
  var clubId = localStorage.getItem("clubId");
  var filWalletAddress = localStorage.getItem("filWalletAddress");
  if(clubId != null) {
    await getContract(filWalletAddress);
    if(contractPublic != undefined) {
      var user = await contractPublic.methods.isMemberOfClub(filWalletAddress,clubId).call();
      if(user) {
        $('.join_club').css('display','none');
        $('.leave_club').css('display','block');
      } else {
        $('.join_club').css('display','block');
        $('.leave_club').css('display','none');
      }
    }
  }
}

function Proposal() {

  const {ownerAddress,accountAddress,provider, handleLogin,userInfo,loading} = UseAlchemy();

  async function FinalWinningPrice(contractPublic){
   await  getContract(accountAddress);

   const signer = provider.getSigner();

   /* next, create the item */

   let contract = new ethers.Contract(
     marketplaceAddress,
     ABI.abi,
     signer
   );
    var clubs1 = await contract.getGamememberById(clubId, proposalId);
    const ans  = await contract.isVotingOn(clubId,proposalId);
  
    if(!ans){
      localStorage.setItem("Final",clubs1.FinalPrice)
        $('#my_votes').text(clubs1.FinalPrice);
        
        $('#Random').text(clubs1.RandomNumber);
        return;
    }
    $('#my_votes').text(clubs1.FinalPrice);
    let min = 49;
    let max = 101;
  
    const Random = Math.floor(Math.random() * (max - min + 1)) + min;
const pricefeed = parseInt(localStorage.getItem("feed"), 10); // Parse the string to an integer with base 10

const score = Random + pricefeed;

    console.log(score)
  
    try{
      const abi = ABI.abi;
        const iface = new ethers.utils.Interface(abi);
        const encodedData = iface.encodeFunctionData("UpdateRandom", [clubId, proposalId,score,Random]);
        const GAS_MANAGER_POLICY_ID = "479c3127-fb07-4cc6-abce-d73a447d2c01";
  
  
  
          const signer = provider.getSigner();
  
          console.log("singer",signer);
          const tx = {
            to: marketplaceAddress,
            data: encodedData,
          };
          const txResponse = await signer.sendTransaction(tx);
          const txReceipt = await txResponse.wait();
  
          notification.success({
            message: 'Transaction Successful',
            description: (
              <div>
                Transaction Hash: <a href={`https://sepolia.scrollscan.com/tx/${txReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer">{txReceipt.transactionHash}</a>
              </div>
            )
          });
          console.log(txReceipt.transactionHash);
  
         
  
  
  
      }catch(error){
        console.log(error)
      }
  }

  async function runProposal(event) {
  
    var filWalletAddress = localStorage.getItem("filWalletAddress");
    await getContract(filWalletAddress);
    if(contractPublic != undefined) {
      var option_execution = $('#option_execution').val()
      var password = $('#passwordShowPVExecution').val();
      if(option_execution == '') {
        $('.errorExecution').css("display","block");
        $('.errorExecution').text("Option is required");
        return;
      }
      if(password == '') {
        $('.errorExecution').css("display","block");
        $('.errorExecution').text("Password is invalid");
        return;
      }
      var clubId = localStorage.getItem("clubId");
      var proposalId = localStorage.getItem("proposalId");
      try {
        const my_wallet = "123";
      
      if(my_wallet !== undefined)
      {
        
  
        $('.errorExecution').css("display","none");
        $('.successExecution').css("display","block");
        $('.successExecution').text("Running...");
        var clubId = localStorage.getItem("clubId");
        var proposalId = localStorage.getItem("proposalId");
        
          try {
            
  
            // if(ans){
            //   toast.error("Voting is still ON")
            //   $('.successExecution').css("display","none");
            //   $('.errorExecution').css("display","block");
            //   $('.errorExecution').text("Voting is still ON");
            //   return;
              
            // }

            
            
       
              const query = await contractPublic.methods.claimprize(clubId,proposalId);
              const encodedABI = query.encodeABI();
  
              try{
                const abi = ABI.abi;
                  const iface = new ethers.utils.Interface(abi);
                  const encodedData = iface.encodeFunctionData("claimprize", [clubId,proposalId]);
              
                  const signer = provider.getSigner();

                  console.log("singer",signer);
                  const tx = {
                    to: marketplaceAddress,
                    data: encodedData,
                  };
                  const txResponse = await signer.sendTransaction(tx);
                  const txReceipt = await txResponse.wait();
    
                  notification.success({
                    message: 'Transaction Successful',
                    description: (
                      <div>
                        Transaction Hash: <a href={`https://sepolia.scrollscan.com/tx/${txReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer">{txReceipt.transactionHash}</a>
                      </div>
                    )
                  });
                  console.log(txReceipt.transactionHash);
              
                  
                }catch(error){
                  console.log(error)
                }
  
  
             
            
            
          } catch (error) {
            // alert(error)
            toast.error(error)
            console.log(error)
            $('.successExecution').css("display","none");
            $('.errorExecution').css("display","block");
            $('.errorExecution').text("Error executing/closing the proposal");
            return;
          }
          
          $('#option_execution').val('');
          $('#passwordShowPVExecution').val('');
          $('.errorExecution').css("display","none");
          $('.successExecution').css("display","block");
          $('.successExecution').text("The execution was successful ");
        } else {
          // alert(error)
          toast.error(error)
          $('.valid-feedback').css('display','none');
            $('.invalid-feedback').css('display','block');
            $('.invalid-feedback').text('The password is invalid');
        }
      }
      catch {
      
        $('.valid-feedback').css('display','none');
            $('.invalid-feedback').css('display','block');
            $('.invalid-feedback').text('The password is invalid');
      }
      
      
    }
  }




  async function voteOnProposal() {
    var filWalletAddress = localStorage.getItem("filWalletAddress");
    await getContract(filWalletAddress);
    
  
    var clubId = localStorage.getItem("clubId");
    var proposalId = localStorage.getItem("proposalId");
   
  
    if(contractPublic != undefined) {
      var option_vote = $('#option_vote').val()
     
      if(option_vote == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Vote is required");
        return;
      }
     
     
      const my_wallet = '123'
      if(my_wallet !== undefined)
      {
        $('.successVote').css("display","block");
        $('.successVote').text("Voting...");
        var optionBool = option_vote == '1' ? true : false;
        try {
          const ans  = await contractPublic.methods.isVotingOn(clubId,proposalId).call();
  
          console.log("ans",ans)
         
          if(!ans){
            toast.error("Voting time periods is over!");
            $('.successVote').css("display","none");
          $('.errorVote').css("display","block");
          $('.errorVote').text("Voting time periods is over!");
            return;
          }

          const chk  =  localStorage.getItem(accountAddress);

               if(chk=="YES"){
                toast.error("You already voted on this proposal");
                $('.successVote').css("display","none");
          $('.errorVote').css("display","block");
          $('.errorVote').text("You already voted on this proposal");
                return;
               }
          
          const query = contractPublic.methods.voteOnProposal(clubId,proposalId, optionBool);
          const encodedABI = query.encodeABI();
       
            const abi = ABI.abi;
              const iface = new ethers.utils.Interface(abi);
              const encodedData = iface.encodeFunctionData("voteOnProposal", [clubId,proposalId, optionBool]);
              const GAS_MANAGER_POLICY_ID = "479c3127-fb07-4cc6-abce-d73a447d2c01";
          
              const signer = provider.getSigner();

              console.log("singer",signer);
              const tx = {
                to: marketplaceAddress,
                data: encodedData,
              };
              const txResponse = await signer.sendTransaction(tx);
              const txReceipt = await txResponse.wait();

              const client = new CovalentClient("cqt_rQVXFd7kyYchKkkxcTjQPh9jPXBg");
              const resp = await client.TransactionService.getTransactionSummary("scroll-sepolia-testnet","0x2f9Eb56e3B8E7208d5562feB95d1Bc5EF432F232");
              const txn = resp.data.items[0].latest_transaction.tx_hash;

              notification.success({
                message: 'Transaction Successful',
                description: (
                  <div>
                    Transaction Hash: <a href={`https://sepolia.scrollscan.com/tx/${txn}`} target="_blank" rel="noopener noreferrer">{txReceipt.transactionHash}</a>
                  </div>
                )
              });

             
              console.log(txReceipt.transactionHash);
                
            
         
        } catch (error) {
          console.log(error.message);
          
        
          $('.successVote').css("display","none");
          $('.errorVote').css("display","block");
          $('.errorVote').text("You already voted on this proposal");
          toast.error("You already voted on this proposal");
          
          return;
        }
        
        $('#option_vote').val('');
        $('#passwordShowPVVote').val('');
        $('#errorVote').css("display","none");
        $('#successVote').css("display","block");
        $('#successVote').text("Your vote was successful ");
        localStorage.setItem(accountAddress,"YES");
        window.location.reload();
      } else {
        $('.valid-feedback').css('display','none');
          $('.invalid-feedback').css('display','block');
          $('.invalid-feedback').text('The password is invalid');
      }
      
    }
  }

  const navigate = useNavigate();
  function Logout(){
    web3.eth.accounts.wallet.clear();
    localStorage.clear();
    navigate('/login');
  
  }


    useEffect(() => {
        {
          FinalWinningPrice();GetWinner();
            GetClub();verifyUserInClub();getProposalById();
        }
      }, []);



  return (
    <div id="page-top">
        <>
  {/* Page Wrapper */}
  <div id="wrapper">
    {/* Sidebar */}
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="/"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink" />
        </div>
        <div className="sidebar-brand-text mx-3">ROYAL</div>
      </a>
      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <li className="nav-item active">
        <a className="nav-link" href="/">
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </a>
      </li>
      <li className="nav-item">
        <Link  className=" nav-link" to="/joinclub">
          <i className="fas fa-fw fa-file-image-o" />
          <span>Available clubs</span>
          </Link>
        
      </li>
      <li className="nav-item">
      <Link  className="nav-link" to="/createclub">
          <i className="fas fa-fw fa-file-image-o" />
          <span>Create club</span>
        </Link>
      </li>
      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block" />
      {/* Sidebar Toggler (Sidebar) */}
      <div className="text-center d-none d-md-inline">
        <button  onClick={Tg} className="rounded-circle border-0" id="sidebarToggle" />
      </div>
    </ul>
    {/* End of Sidebar */}
    {/* Content Wrapper */}
    <div id="content-wrapper" className="d-flex flex-column">
      {/* Main Content */}
      <div id="content">
        {/* Topbar */}
      
        {/* End of Topbar */}
        {/* Begin Page Content */}
        <div className="container-fluid">
          {/* Page Heading */}
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">
              <span className="club_name" />
            </h1>
          </div>
          {/* Content Row */}
          <div className="row">
            {/* Earnings (Monthly) Card Example */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Club Balance (ETH)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800 club_balance">
                        -
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Proposals
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800 club_proposals">
                        -
                      </div>
                      <a
                        href="/createproposal"
                        className="btn btn-secondary btn-sm mt-2"
                      >
                        Create
                      </a>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        Proposals{" "}
                      </div>
                      <a className="btn btn-secondary" href="/club">
                        See all proposals
                      </a>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div> 

            <div className="col-xl-3 nc col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        See All Data{" "}
                      </div>
                      
                        <div className="btn btn-primary" onClick={verify}>
                     
                       Verify Dao Data
                       </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* Content Row */}
          <div className="row">
            {/* Area Chart */}
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow mb-4">
                {/* Card Header - Dropdown */}
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Proposal
                  </h6>
                </div>
                {/* Card Body */}
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      Creator:{" "}
                      <b>
                        <span id="proposal_creator" />
                      </b>{" "}
                      <br />
                      Destination:{" "}
                      <b>
                        <span id="proposal_destination" />
                      </b>{" "}
                      <br />
                      USER BID :{" "}
                      <b>
                        <span id="proposal_amount" />
                      </b>{" "}
                      <br />
                      Proposal Starts At:{""}
                      <b>
                        <span id="proposedAt" /> 
                      </b>{""}
                      <br />
                      Proposal Ends At:{""}
                      <b>
                        <span id="proposalExpireAt" />
                      </b>{""}
                      <br />
                      Fianl Prize:{""}  
                      <b>
                        <span id="my_votes" />
                      </b>{""}
                      <br/>
                      
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>
            {/* Pie Chart */}
            <div className="col-xl-4 col-lg-5">
              <div
                className="card shadow mb-4 leave_club"
                style={{ display: "none" }}
              >
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Status: <span id="proposal_status" />
                  </h6>
                </div>
                
              </div>
              <div
                className="card shadow mb-4 creator_options"
                style={{ display: "none" }}
              >
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Claim Full Bounty</h6>
                </div>
                <div className="card-body card-body1">
                  <p>
                    Congrats You Won: <br />
                    
                    <br />
                   
                    <div href="" id="btnExecution" onClick={() => {
                        runProposal();
                      }} className="btn btn-success">
                      Claim You Prize
                    </div>{" "}
                    <br />
                  </p>
                  <div
                    className="successExecution valid-feedback"
                    style={{ display: "none" }}
                  />
                  <div
                    className="errorExecution invalid-feedback"
                    style={{ display: "none" }}
                  />
                  <p />
                </div>
              </div>
            </div>
            
            <div>
            
            
            </div>
          </div>
          {/* Content Row */}
          <div className="row">
            <div className="col-lg-6 mb-4"></div>
          </div>
        </div>
        {/* /.container-fluid */}
      </div>
      {/* End of Main Content */}
      {/* Footer */}
      <footer className="sticky-footer bg-white"></footer>
      {/* End of Footer */}
    </div>
    {/* End of Content Wrapper */}
  </div>
  {/* End of Page Wrapper */}
  {/* Scroll to Top Button*/}
  <a className="scroll-to-top rounded" href="#page-top">
    <i className="fas fa-angle-up" />
  </a>
  {/* Logout Modal*/}
  <div
    className="modal fade"
    id="seeAccountModal"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Account
          </h5>
          <button
            className="close"
            type="button"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          Address: <br /> <div className="current_account" />
          <br />
          <span
            style={{ fontSize: "x-small" }}
            className="current_account_text"
          />
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  </div>
  {/* Logout Modal*/}
  <div
    className="modal fade"
    id="logoutModal"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Ready to Leave?
          </h5>
          <button
            className="close"
            type="button"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          Select "Logout" below if you are ready to end your current session in
          this browser.
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            type="button"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <div className="btn btn-primary" onClick={Logout} id="btnLogout">
            Logout
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    </div>
  )
}

// getClub();
//             verifyUserInClub();
//             getProposalById();

export default Proposal