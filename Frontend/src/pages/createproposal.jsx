import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tg from "../components/toggle";
import $ from 'jquery'; 
import { marketplaceAddress } from "../config";
import {Web3} from 'web3';
import ABI from "../SmartContract/artifacts/contracts/InvestmentClub.sol/InvestmentClub.json"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import lighthouse from '@lighthouse-web3/sdk'
import axios from 'axios';
import {ethers} from 'ethers';
import { UseAlchemy } from '../components/Hooks/Connection';
import { notification } from 'antd';
import { CovalentClient } from "@covalenthq/client-sdk";
const feed = localStorage.getItem("feed")

// import transferTokens from "../transfer-tokens";

const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia-rpc.scroll.io/"));
const apiKey = "207e0c12.0ca654f5c03a4be18a3185ea63c31f81"
var contractPublic = null;
var cid = null;

async function getContract(userAddress) {
  contractPublic =  new web3.eth.Contract(ABI.abi,marketplaceAddress);
  console.log(contractPublic)
  if(userAddress != null && userAddress != undefined) {
    contractPublic.defaultAccount = userAddress;
  }
}




function CreateProposal() {
  const {ownerAddress,accountAddress,provider, handleLogin,userInfo,loading} = UseAlchemy();

  var clubId = localStorage.getItem("clubId");
  const [Password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  
  async function createProposal() {

    var walletAddress = localStorage.getItem("filWalletAddress");
    
    // alert(walletAddress) /// /////
    await getContract(walletAddress);

    const ans  = await contractPublic.methods.checkContri(clubId,walletAddress).call();

    if(!ans){
      
      notification.error({
        message: 'Please contribute to the club first',
        
      });
      
     
        return;
}


    toast.info('Prposal Creation intiated ...', {
      position: "top-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
    
    if(contractPublic != null) {
      var proposal_description = $('#proposal_description').val();
      var proposal_address = $('#proposal_address').val();
      var proposal_amount = $('#proposal_amount').val();
      var password = $('#trx_password').val();
      if(proposal_description == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Description is required");
        return;
      }
      if(proposal_address == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Destination address is required");
        return;
      }
      if(proposal_amount == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Amount is required");
        return;
      }
      if(password == '') {
        $('#errorCreateProposal').css("display","block");
        $('#errorCreateProposal').text("Password is invalid");
        return;
      }
      
      const my_wallet = await web3.eth.accounts.wallet.load(password);
      if(my_wallet !== undefined)
      {
        $('.loading_message_creating').css("display","block");
        proposal_amount = web3.utils.toWei(proposal_amount.toString(), 'ether');

        toast.success("Proposal Uploaded to LightHouse")

        const proposal = JSON.stringify({
          clubId,proposal_amount, proposal_address, proposal_description,description

        });
        

        const data = JSON.stringify({
          proposal

        });


        // const response = await lighthouse.uploadText(data, apiKey, proposal_description)

        // console.log("The cid is ",response.data.Hash);
        // const cid11 = response.data.Hash;
        // var proposalId = localStorage.getItem("proposalId");
        // localStorage.setItem(proposalId-100,cid11);

        // cid = response.data.Hash;
        
        

        // const query = contractPublic.methods.createProposal(clubId,proposal_amount, proposal_address, proposal_description,cid);
        // const encodedABI = query.encodeABI();

        
        
        $('.loading_message_creating').css("display","block");
        console.log("The contractPublic is ",contractPublic)
        const signer = provider.getSigner();
       
        try{

          let contract = new ethers.Contract(
            marketplaceAddress,
            ABI.abi,
            signer
          );

          var price = await contract.LPrice();

          const decimal_number1 = parseInt(price, 16);
          let numberAsString = decimal_number1.toString();
    
    // Remove the last 6 characters
    let trimmedNumberString = numberAsString.slice(0, -6);
         
    
          const abi = ABI.abi;
            // const iface = new ethers.utils.Interface(abi);
            // const encodedData = iface.encodeFunctionData("FillGameMember", [proposal_amount,proposal_address,123]);
            const GAS_MANAGER_POLICY_ID = "479c3127-fb07-4cc6-abce-d73a447d2c01";
        
            

              // console.log("singer",signer);
              // const tx = {
              //   to: marketplaceAddress,
              //   data: encodedData,
              // };
              let transc = await contract.FillGameMember(clubId,trimmedNumberString,proposal_address,proposal_amount);
              // const txResponse = await signer.sendTransaction(tx);
              const txReceipt = await transc.wait();
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


              

              

          }catch(error){
            console.log(error)
          }
            
       
  
  
  
        
        $('#proposal_description').val('');
        $('#proposal_address').val('');
        $('#proposal_amount').val('');

        $('#trx_password').val('');
        $('#errorCreateProposal').css("display","none");
        $('.loading_message_creating').css("display","none");
        $('#successCreateProposal').css("display","block");
        
        $('#successCreateProposal').text("Proposal created successfully with description: " + proposal_description);
      } else {
        $('.valid-feedback').css('display','none');
        $('.loading_message_creating').css("display","none");
          $('.invalid-feedback').css('display','block');
          toast.error('The password is invalid')
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
  


  return (
    <div id="page-top">
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
        <a className="nav-link" href="/joinclub">
          <i className="fas fa-fw fa-file-image-o" />
          <span>Available clubs</span>
        </a>
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
            <h1 className="h3 mb-0 text-gray-800">Create a new proposal</h1>
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
                       Price (BTC/USD)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800 club1_balance club_balance">
                        {feed}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        Dashboard
                      </div>
                      <a className="btn btn-primary" href="/">
                        Go to Dashboard
                      </a>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        Proposals{" "}
                      </div>
                      <Link  className="btn btn-secondary" to="/club">
                      
                        See all proposals
                      </Link>
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
            <div className="col-xl-12 col-lg-9">
              <div className="card shadow mb-4">
                {/* Card Header - Dropdown */}
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Create your own proposal
                  </h6>
                </div>
                {/* Card Body */}
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                   

                      Destination address:{" "}
                      
                      <input
                        type="text"
                        id="proposal_address"
                        className="form-control form-control-user"
                        value={destination}
onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter the ETH destination address: 0x....."
                      />{" "}
                      <br />
                      Predicted Price (in ETH):{" "}
                      <input
                        type="number"
                        id="proposal_amount"
                        className="form-control form-control-user"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter the Price (Be carefull)"
                      />{" "}
                      <br />
                      
                      <br />
                      <br />
                      <input
                        type="button"
                        id="createProposalButton"
                        defaultValue="Create"
                        onClick={() => {
                         
                          createProposal();
                        }}
                        className="btn btn-primary btn-block"
                      />
                      <span
                        className="loading_message_creating"
                        style={{ display: "none" }}
                      >
                        Creating the proposal...
                      </span>{" "}
                      <br />

                      
                      <p
                        className="valid-feedback"
                        id="successCreateProposal"
                        style={{ display: "none" }}
                      />
                      <p
                        className="invalid-feedback"
                        id="errorCreateProposal"
                        style={{ display: "none" }}
                      >
                        Error
                      </p>
            
                     
                    </div>
                  </div>
                </div>
              </div>
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

  
  
        
 
</div>

  )
}

export default CreateProposal