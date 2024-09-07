import React from 'react'
import { useState, useEffect } from "react";
import { createClient } from "urql";


var proposalId = localStorage.getItem("proposalId");

function Price() {



  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const QueryURL = "https://gateway-arbitrum.network.thegraph.com/api/1e53e29a3e1334d58c0e71d6f1f15ef1/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";

  const query = `
    {
        bundles(first: 5) {
            id
            ethPriceUSD
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
        setTokens(data.bundles);
        
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
   
    </div>
    
    <div>
      {isLoading ? (
        // Show loading indicator while data is being fetched
        <div>Loading...</div>
      ) : tokens.length > 0 ? (
        tokens.map((token, index) => (

            <div className='text-xl' key={index}>
                  {token.ethPriceUSD}
            </div>
        ))
      ) : (
        <div>No data available</div>
      )}
      </div>
    </>
  );
};
export default Price


