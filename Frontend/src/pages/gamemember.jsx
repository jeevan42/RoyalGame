import React from 'react'
import { useState, useEffect } from "react";
import { createClient } from "urql";


function Gamemember() {
 
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
  
    const QueryURL = "https://api.studio.thegraph.com/query/67475/treasured/v0.0.1";
  
    const query = `
      {
        gamemembers(first: 5) {
            clubId
            creator
            priceFeed
            predictedPrice
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
          setTokens(data.gamemembers);
          
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
                   ClubId: {token.clubId} , Creator: {token.creator} , PriceFeed: {token.priceFeed} , PredictedPrice: {token.predictedPrice}
              </div>
          ))
        ) : (
          <div>No data available</div>
        )}
        </div>
      </>
    );
  };
export default Gamemember