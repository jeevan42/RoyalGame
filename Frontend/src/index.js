import React from "react";

import { App } from "./App";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { Transition } from '@headlessui/react';

import  {ScrollSepolia} from '@particle-network/chains';
import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';


import('buffer').then(({ Buffer }) => {
  window.Buffer = Buffer;
});

ReactDOM.render(
    <React.StrictMode>
      <AuthCoreContextProvider
      options={{
        projectId: "2509d133-0dd5-409a-bf0d-7db2b6648bbf",
        clientKey: "cbdskjEjAxMDhYksv0ubDZo51l599QCOHZqBpPA0",
        appId: "efb5c91d-cfae-49d5-bacb-8b30e35e83f9",
        erc4337: {
          name: 'SIMPLE',
          version: '1.0.0',
        },
        wallet: {
          visible: false,
          customStyle: {
              supportChains: [ScrollSepolia],
          }
        }
      }}
    >
  
      <BrowserRouter>
      
        <Routes>
        
          <Route path="*" element={ <App /> }>
          
          </Route>
        </Routes>

       
      </BrowserRouter>
      
      <ToastContainer/>
      <Transition show={true}/>

    </AuthCoreContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
  