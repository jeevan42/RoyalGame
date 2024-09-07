import React, { useState, useEffect, useContext, useMemo } from "react";

import { ParticleSigner } from "@tabascoweb3/aa-signers/particle";

import {Web3} from 'web3';



import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";


const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai.infura.io/v3/95688893704a4d5bac083296c3547383"));
const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

const AlchemyContext = React.createContext({
  ownerAddress: undefined,
  accountAddress: undefined,
  provider: undefined,
  handleLogin: undefined,
  userInfo: undefined,
  loading: undefined,
  Logout: undefined,
});

export const UseAlchemy = () => {
  return useContext(AlchemyContext);
};

export const BiconomyProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [accountAddress, setAccountAddress] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [providerState, setProviderState] = useState(null);

  const particleSigner = useMemo(() => new ParticleSigner({
    projectId: "2509d133-0dd5-409a-bf0d-7db2b6648bbf",
    clientKey: "cbdskjEjAxMDhYksv0ubDZo51l599QCOHZqBpPA0",
    appId: "efb5c91d-cfae-49d5-bacb-8b30e35e83f9",
  }), []);

  const particle = new ParticleAuthModule.ParticleNetwork({
    projectId: "2509d133-0dd5-409a-bf0d-7db2b6648bbf",
    clientKey: "cbdskjEjAxMDhYksv0ubDZo51l599QCOHZqBpPA0",
    appId: "efb5c91d-cfae-49d5-bacb-8b30e35e83f9",
  });

  useEffect(() => {
    const checkLogin = async () => {
      if (particleSigner.inner.auth.isLogin()) {
        setUserInfo(await particleSigner.getAuthDetails());
      }
    };
    checkLogin();
  }, [particleSigner]);



  const handleLogin = async () => {
    setLoading(true);

    if (!particleSigner.inner.auth.isLogin()) {
      await particleSigner.authenticate({
        loginOptions: {},
        login: async (loginOptions) => {
          await particleSigner.inner.auth.login(loginOptions);
        },
      });
    }

    setUserInfo(await particleSigner.getAuthDetails());

    


    const bundler = new Bundler({
      // get from biconomy dashboard https://dashboard.biconomy.io/
      bundlerUrl: "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
      chainId: ChainId.AVALANCHE_TESTNET, // or any supported chain of your choice
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });
    
    const paymaster = new BiconomyPaymaster({
      // get from biconomy dashboard https://dashboard.biconomy.io/
      paymasterUrl: "https://paymaster.biconomy.io/api/v1/43113/xd_S0nE4G.5c6f49a1-eba3-45c0-bd5d-fdf633c371d1",
    });
    

  

    setLoading(false);


    try {
      const userInfo = await particle.auth.login();
      console.log("Logged in user:", userInfo);
      const particleProvider = new ParticleProvider(particle.auth);
      const web3Provider = new ethers.providers.Web3Provider(
        particleProvider,
        "any",
      );
      setProviderState(web3Provider);
  
      const module = await ECDSAOwnershipValidationModule.create({
        signer: web3Provider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      });
  
      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.AVALANCHE_TESTNET,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module,
      });

      localStorage.setItem("CheckLogin","Yes");
  
      const address = await biconomySmartAccount.getAccountAddress();
      setAccountAddress(address)
      const balanceWei = await web3.eth.getBalance(await biconomySmartAccount.getAccountAddress());
      
      // Convert Wei to Ether (assuming Ethereum)
      const balanceEther = web3.utils.fromWei(balanceWei, "ether");
      localStorage.setItem("smartbal",balanceEther);
      console.log({ address })
    } catch (error) {
      console.error(error);
    }
    
  };

  const  Logout = () => {

    localStorage.clear();
    setAccountAddress(null);
    setOwnerAddress(null);
  };



  return (
    <AlchemyContext.Provider
      value={{
        ownerAddress: ownerAddress,
        accountAddress: accountAddress,
        provider: providerState,
        userInfo: userInfo,
        handleLogin,
        loading,
        Logout,
      }}
    >
      {children}
    </AlchemyContext.Provider>
  );
};