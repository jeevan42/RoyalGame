import { useEthereum, useConnect, useAuthCore } from '@particle-network/auth-core-modal';
import { GnosisTestnet} from '@particle-network/chains';
import  {ScrollSepolia} from '@particle-network/chains';
import { AAWrapProvider, SendTransactionMode, SmartAccount } from '@particle-network/aa';
import { ethers } from 'ethers';
import { notification } from 'antd';
import React, { useState, useEffect, useContext, useMemo } from "react";
// import './App.css';



const AlchemyContext = React.createContext({
  ownerAddress: undefined,
  accountAddress: undefined,
  provider: undefined,
  handleLogin: undefined,
  userInfo: undefined,
  loading: undefined,
  Logout: undefined,
  balance: undefined,
});


export const UseAlchemy = () => {
  return useContext(AlchemyContext);
};

export const BiconomyProvider = ({ children }) => {


   const [loading, setLoading] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [userInfo1, setUserInfo] = useState(null);
  const [providerState, setProviderState] = useState(null);


  const [accountAddress, setAccountAddress] = useState(null);


  const { provider } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();


  const smartAccount = new SmartAccount(provider, {
    projectId: "2509d133-0dd5-409a-bf0d-7db2b6648bbf",
    clientKey: "cbdskjEjAxMDhYksv0ubDZo51l599QCOHZqBpPA0",
    appId: "efb5c91d-cfae-49d5-bacb-8b30e35e83f9",
    aaOptions: {
      accountContracts: {
        SIMPLE: [{ chainIds: [ScrollSepolia.id], version: '1.0.0' }] // Or BICONOMY, LIGHT, CYBERCONNECT
      }
    }
  });

  const customProvider = new ethers.providers.Web3Provider(new AAWrapProvider(smartAccount, SendTransactionMode.Gasless), "any");
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo, smartAccount, customProvider]);

  const fetchBalance = async () => {
    const address = await smartAccount.getAddress();
    const balanceResponse = await customProvider.getBalance(address);
    setBalance(ethers.utils.formatEther(balanceResponse));
    localStorage.setItem("smartbal",ethers.utils.formatEther(balanceResponse));

   
    setAccountAddress(address);
    localStorage.setItem("filWalletAddress",await smartAccount.getAddress())
    
    console.log(ethers.utils.formatEther(balanceResponse))
  };

  const handleLogin = async (authType) => {
    setLoading(true);
    if (!userInfo) {
      await connect({
        socialType: authType,
        chain: ScrollSepolia,
      });
    }
    setLoading(false);
  };

  const  Logout = async  () => {
    await disconnect();
     
        
      };



  return (
        <AlchemyContext.Provider
      value={{
        ownerAddress: ownerAddress,
        accountAddress: accountAddress,
        provider: customProvider,
        userInfo: userInfo,
        handleLogin,
        loading,
        Logout,
        balance,
      }}
    >
      {children}
    </AlchemyContext.Provider>
  );
   
};