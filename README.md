

![Untitled - Frame 1](https://github.com/Vikash-8090-Yadav/Royal/assets/85225156/18814a50-41f8-4f87-8ae1-d7c53355b5b9)



# Demo Video: https://youtu.be/4VdIINWHOT8?si=I7_2KwNjRViRDmul

#  Frontend deployed at: https://dao-automate.vercel.app/


## Introduction 

#### Royal is prediction game where user have to add randon number b/w 4-100  to the LINK/USD price feed and  the  winner will get the full pool  bounty. 


## Contract Info -> The contract is deployed on Scroll sepolia

Contract Address: 0x46cDAe0d7c2f9421f494F6b378A4165dE98F06C5



### Welcome to our decentralized application (dapp), where you can participate in an exciting prediction game! Here's how it works:

- **Club Creation:** Any member can create a club. When creating a club, we fetch the current ETH/USD price from ChainLink and save it securely on the blockchain.

- **Club Opening:** The club is open for 2 minutes, during which interested players can join and participate.

- **Prediction Proposal:** Before the game deadline, players must propose the price they predict for a certain event. The game is open for 5 minutes.

- **Guessing Game:** Players choose a number between 50 and 100. This number is then combined with the data feed fetched from ChainLink.

- **Reveal and Reward:** At the end of the game, the smart contract reveals the combined data feed (summed with a random number). If a player's prediction matches or is closest to the revealed number, they win the full prize from the club pool.


 ## Note: The user have to  deposit some eth to  the club pool before craeting the proposal


## ChainLink 

I Usedd Price Feed  in my project. User have to Guess a number b/w 50-100, then have to sum up with the pricefeed shown on their dashboard after that at the end of the smart contract will reveasl the winner.

##  Please refer this code to see how I used Price feed in my project ->  https://github.com/Vikash-8090-Yadav/Royal/blob/main/Frontend/src/pages/createclub.jsx#L194

## State Chnage ->  if user won then he / she can claim full bonty prize (Only when won)

https://github.com/Vikash-8090-Yadav/Royal/blob/main/Frontend/src/pages/proposal.jsx#L208


# Working flow 

## Dashboard 
- Here user can see their dashboard, their clubs, balance and proposals and profile secttion as well

![Screenshot from 2024-05-27 10-50-16](https://github.com/Vikash-8090-Yadav/Royal/assets/85225156/2520e6b1-0f0d-4ed7-a184-bbf46fe3cd30)

## Create club (LINK USD Price fetched  here)
- User can create club for prticular asset like ETH USD, LINK USD etc

![Screenshot from 2024-05-27 10-53-23](https://github.com/Vikash-8090-Yadav/Royal/assets/85225156/8943a334-5c9e-4986-99b1-d722d25bb550)


##  Contribute to  the club pool 

Without donating to the club users can't  participate in the  game

![Screenshot from 2024-05-27 10-54-25](https://github.com/Vikash-8090-Yadav/Royal/assets/85225156/f5cec6e5-057a-47fb-9ded-55c6e46d6b35)

## Create prposal 

After depositing to the club  users can create their proposal for their  Guessed price

![Screenshot from 2024-05-27 10-55-46](https://github.com/Vikash-8090-Yadav/Royal/assets/85225156/8256bc52-9a00-42f1-975e-9419a1e9a125)

##  Winner reveal after game ends 
 After the game deadline the winner declare

![Screenshot from 2024-05-27 10-54-55](https://github.com/Vikash-8090-Yadav/Royal/assets/85225156/8f813fd5-1d46-4288-9702-e8f3fec459e0)


## 🛠️Technologies we used

[![Powered by Filecoin](https://img.shields.io/badge/Powered_by-Filecoin-0174F2?logo=filecoin)](https://filecoin.io/)
[![Powered by Lighthouse](https://img.shields.io/badge/Powered_by-Lighthouse-ff69b4?logo=lighthouse)](https://lighthouse.filecoin.io/)
[![Built with React.js](https://img.shields.io/badge/Built_with-React.js-61DAFB?logo=react)](https://reactjs.org/)
[![Developed in Motoko](https://img.shields.io/badge/Developed_in-Motoko-2196F3?logo=dfinity)](https://sdk.dfinity.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled_with-Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Powered by Ethereum](https://img.shields.io/badge/Powered_by-Ethereum-3C3C3D?logo=ethereum)](https://ethereum.org/)

| Technology        | Description                                                | Official Website                                     |
|-------------------|------------------------------------------------------------|------------------------------------------------------|
| React.js          | JavaScript library for building user interfaces, often used for server-rendered or statically-generated applications | [React.js](https://reactjs.org/)                      |
| Tailwind CSS      | Utility-first CSS framework for building custom designs   | [Tailwind CSS](https://tailwindcss.com/)              |
| Solidity | Programming language used for smart contract development on the Ethereum blockchain | https://docs.soliditylang.org/ |
|LightHouse | Store file Secure, Reliable, & Lightning-Fast with Lighthouse. |https://www.lighthouse.storage/|
|ChainLLink | Chainlink is the decentralized computing platform powering the verifiable web| https://chain.link/|

## What Next for Royal?

- ChainLink automation: I can use chainLink automation as well for the funds distribution to the winner but due to the lack of time I can't
- ChainLink function: I can use ChainLink function to  check for the genuine users and avoid spams proposal


## Challenges  I faced 

-   while fetching the price feed and combining this with the dapp  throws me lots of errors like price is  not fteched properly and state chnange.

## Restrictions

The Royal smart contract has some restrictions:

- Up to 99 members per club (in many jurisdictions, such as the USA and Chile, this is the maximum limit of club members for certain purposes and types of clubs).
- Only members can participate in club instances.
- Only members who contribute funds to a club have the right to create proposals.
