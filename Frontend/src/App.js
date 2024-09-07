import React from "react";
import { BrowserRouter, Routes, Route,Navigate, Link } from "react-router-dom";
import { useState,useEffect } from "react";
import Layout from "./components/Layout";
import JoinClub from "./pages/joinclub";
import Base from "./components/base";
import CreateClub from "./pages/createclub";

import DotLoader from "react-spinners/HashLoader";
import CreateProposal from "./pages/createproposal";
import Club from "./pages/club";
import Proposal from "./pages/proposal";

// import "./components/Auth.css"
import Register from "./pages/register";
import Login from "./pages/login";
// import
import { BiconomyProvider } from "./components/Hooks/Connection";
import { UseAlchemy } from "./components/Hooks/Connection";
export const App = () =>{

    // Render the protected routes if authenticated
  

    return (
      <BiconomyProvider>
      <div>
        <Routes>

          <Route element={<Layout />}>
         
          <Route index element={<Base />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/joinclub" element={<JoinClub />} />
            <Route path="/createclub" element={<CreateClub />} />
            <Route path="/club" element={<Club />} />
            <Route path="/createproposal" element={<CreateProposal />} />
            <Route path="/proposal" element={<Proposal />} />
          </Route>
        </Routes>
      </div>
      </BiconomyProvider>
    );
  
}


