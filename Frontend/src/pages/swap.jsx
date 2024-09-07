import React from 'react'

import { useState, useEffect } from "react";
import { createClient } from "urql";


var proposalId = localStorage.getItem("proposalId");


function Swap() {
 
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
  
    const QueryURL = "https://gateway-arbitrum.network.thegraph.com/api/1e53e29a3e1334d58c0e71d6f1f15ef1/subgraphs/id/FQ6JYszEKApsBpAmiHesRsd9Ygc6mzmpNRANeVQFYoVX";
  
    const query = `
      {
        swaps (first: 4){
            hash
            amountInUSD
            amountOut
          }
         
      }
    `;
  
    const client = createClient({
      url: QueryURL
    });
  
    useEffect(() => {
      if (!client) {
        return;
      }
  
      const getTokens = async () => {
        try {
          const { data } = await client.query(query).toPromise();
          setTokens(data.swaps);
          
          // console.log(data.proposalVoteds)
          setIsLoading(false); // Data is loaded
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      getTokens();
    }, [client]);
  
    return (
      <>
      <div>
     <h3 text-red>SWAP (TOKENS)</h3>
      </div>
      <br></br>
      <div>
        {isLoading ? (
          // Show loading indicator while data is being fetched
          <div>Loading...</div>
        ) : tokens.length > 0 ? (
          tokens.map((token, index) => (
  
              <div className='text-xl' key={index}>
                   amountInUSD: {token.amountInUSD} ,amountOut: {token.amountOut} , hash: {token.hash}
              </div>
          ))
        ) : (
          <div>No data available</div>
        )}
        </div>
      </>
    );
}

export default Swap