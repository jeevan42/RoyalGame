import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Web3} from 'web3';
import $ from 'jquery'; 
import { ParticleSigner } from "@alchemy/aa-signers/particle";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactory,
} from "@alchemy/aa-accounts";
import { ParticleNetwork } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { LocalAccountSigner } from "@alchemy/aa-core";
import { polygonMumbai } from "viem/chains";
import { WalletClientSigner,  SmartAccountSigner } from "@alchemy/aa-core";
import { createWalletClient, custom } from "viem";
import { ethers } from "ethers";
// import { createParticleSigner } from '../components/Hooks/particle';
// import { createArcanaAuthSigner } from '../components/Hooks/arcana';
import Register from './register'

import { UseAlchemy } from '../components/Hooks/Connection';

const chain = polygonMumbai;



const web3 = new Web3(new Web3.providers.HttpProvider("https://api.avax-test.network/ext/bc/C/rpc"));
var contractPublic = null;
function Regis(){

  return <Register/>

}

const PRIVATE_KEY = "0x4b37e644ab78c477cf92ed880dd52d5b0d50bfe36056696d1e05ba480d5abaa3"; // Replace with the private key of your EOA that will be the owner of Light Account


const eoaSigner =
  LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY); 



  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";


function Login() {
  const {Account,smartAccountAddress,provider, handleLogin} = UseAlchemy();
  
  const [loading, setLoading] = useState(false)
  const [smartAccount, setSmartAccount] = useState()
  // const [smartAccountAddress,const particle = new ParticleNetwork({...}); setSmartAccountAddress] = useState()
  // const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [providerState, setProviderState] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  const navigate = useNavigate();

  
function generateWalletFromPrivateKey()
{

    // const privateKey = $('#pvKeyValue').val();
    // const password = $('#pvKeyNewPasswordValue').val();
    
    // if(privateKey != '' && password != '') {
    //   // alert(privateKey)
      
    //   web3.eth.accounts.wallet.clear();
    //   web3.eth.accounts.wallet.add(privateKey);
    //   web3.eth.accounts.wallet.save(password);
    //   localStorage.setItem('filWalletAddress', web3.eth.accounts.privateKeyToAccount(privateKey).address);
    //   confirmKeySaved();
    // }
    // else {
    //   $('#errorLogin').css("display","block");
    //   $('#errorLogin').text('The private key and password must not be empty.');
        
    // }
}
function confirmKeySaved() {
  localStorage.authenticated = "true";
  
navigate('/');
  
}



  return (
    <div className="bg-gradient-primary">
    <div className="container">
  {/* Outer Row */}
  <div className="row justify-content-center">
    <div className="col-xl-10 col-lg-12 col-md-9">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          {/* Nested Row within Card Body */}
          <div className="row">
            <div className="col-lg-6 d-none d-lg-block bg-login-image " />
            <div className="col-lg-6">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Treasure Dao - Welcome Back!</h1>
                </div>
                <form className="user">
                  <div className="form-group">
                    <input type="password" className="form-control form-control-user" id="pvKeyValue" aria-describedby="emailHelp" placeholder="Enter your private key" />
                    <input type="password" className="form-control form-control-user" id="pvKeyNewPasswordValue" aria-describedby="emailHelp" placeholder="Enter a new password" />
                  </div>
                  <div id="generateWalletPrivKeyButton" onClick={handleLogin} className="btn btn-primary btn-user btn-block">
                    Login with your private key
                  </div>
                  
                  <p className="invalid-feedback" id="errorLogin" />
                  <hr />
                </form>
                <hr />
                <div className="text-center">
                  <a className="small"  onClick={Regis} href="/register" >Create an Account!</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div></div>

  )
}

export default Login