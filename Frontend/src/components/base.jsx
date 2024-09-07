import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link,Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


import Gamemember from "../pages/gamemember";
import GetMyClubs from "../getMyClubs";
import Login from "../pages/login";
import Tg from "./toggle";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { marketplaceAddress } from "../config";
import { UseAlchemy } from "./Hooks/Connection";
import $, { error } from 'jquery'; 
import { marketplaceAddress } from "../config";
import {Web3} from 'web3';
import { ethers } from "ethers";


const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia-rpc.scroll.io/"));
var contractPublic = null;


async function ShowPrivateKey(){
  var password = $('#passwordShowPV').val();
  const my_wallet = await web3.eth.accounts.wallet.load(password);
  const PrivateKey = my_wallet[0].privateKey;

  try {
    // var privateKey = CryptoJS.AES.decrypt(localStorage.getItem('aeWalletSecret'), password).toString(CryptoJS.enc.Utf8);
    $('#privateKetShowed').text(PrivateKey);
  }
  catch(err) {
    alert('The password is wrong. Please, enter the right password.')
  }
  $('#passwordShowPV').val('');
  return false;
}

async function checkBalance() {
  // console.log(localStorage.getItem("LL"));
  
  
  try {
    const myWallet = localStorage.getItem("filWalletAddress");
    if (!myWallet) {
      // Handle the case where the wallet address is not available in localStorage
      return;
    }
    
    // Assuming you've properly initialized the web3 instance before this point
    const balanceWei = await web3.eth.getBalance(myWallet);
    
    // Convert Wei to Ether (assuming Ethereum)
    const balanceEther = web3.utils.fromWei(balanceWei, "ether");
    
    // Update the balance on the page
    $('.view_balance_address').text(balanceEther);
  } catch (error) {
    console.error("Error:", error);
  }
}

// async function ff(provider,accountAddress){
//   const balance = await provider.request({
//     method: "eth_getBalance",
//     params: [accountAddress],
//   });
//   // console.log(web3.fromWei(balance))
//   const balanceInEther = web3.utils.fromWei(balance, "ether");
//   console.log(balanceInEther)
// }
function Base() {
  const {ownerAddress,accountAddress,provider, handleLogin,userInfo} = UseAlchemy();
  const [password, setPassword] = useState('');

  console.log("Provider",provider)
  console.log("smartAccountAddress",accountAddress)
  console.log("Account",ownerAddress)
  // console.log("userInfo",userInfo.name);
  
  const navigate = useNavigate();
  function Logout(){
    web3.eth.accounts.wallet.clear();
    localStorage.clear();
  
  }

  


  
  

  useEffect(() => {
    {
      
      if(localStorage.getItem('filWalletAddress') != null) {
        checkBalance();
        //checkCurrentBlock();
        const myWallet = localStorage.getItem("filWalletAddress")
        $('.current_account_text').text(myWallet);
      }

      GetMyClubs(); // Call the imported function here
    }
  }, []);
  var isAuthenticated = localStorage.getItem('filWalletAddress');
    // alert(isAuthenticated)


  

  return (
    <div  id="page-top">
  {/* Page Wrapper */}
  <div  id="wrapper">
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
        <div className="sidebar-brand-text mx-3"> ROYAL</div>
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
            <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
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
                        Balance (ETH)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800 view_balance_address">
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
            
            <div className="col-xl-3 nc col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        Create club{" "}
                      </div>
                      <a className="btn btn-primary" href="/createclub">
                        Create a new club
                      </a>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300" />
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
                        Clubs{" "}
                      </div>
                      <Link  className=" btn btn-secondary" to="joinclub">
                        See available clubs
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
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow mb-4">
                {/* Card Header - Dropdown */}
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    My clubs
                  </h6>
                </div>
                
                {/* Card Body */}
                <div className="card-body my_clubs">
                  <span className="loading_message">Loading...</span>

                </div>
              </div>
              <div className="mmn">
                  
                  <span className="mmn font-weight-bold  text-xl msg"></span>
                </div>
            </div>
            {/* Pie Chart */}
            
            <div className="col-xl-4 col-lg-5">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    My Smart Address
                  </h6>
                </div>
                <div className="card-body">
                  <p>
                    <b>
                      <span className="current_account_text" />
                    </b>
                  </p>
                </div>
              </div>
             
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                  ROYAL
                  </h6>
                </div>
                <div className="card-body">
                  <p>
                  ROYAL is Prediction Game , predict the price and get the  full bounty
                  </p>
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
  
};

export default Base;
