
require ('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
task("accounts","Prints the list of the accounts",async (taskArgs , hre )=>{
  const accounts = await hre.ethers.getSigners();

  for(const account of accounts){
    console.log(account.address);
  }
})

module.exports = {
  solidity: "0.8.10",

  ddefaultNetwork: "scrollSepolia",
  networks:{
    hardhat:{},
    scrollSepolia: {
      gasPrice:800000000,
      url: "https://sepolia-rpc.scroll.io/" || "",
      chainId: 534351,
      accounts: ['5753e65f56865a161fbf41932a0d855139a4ce9dc20d82fb655bff393fc41702']
    },
  },
    etherscan: {
      apiKey: "9VZPK5DTGX6V4Z81J8RY781S4U8CPQIANA",
      customChains: [
        {
          network: "scrollSepolia",
          chainId: parseInt("534351"),
          urls: {
            apiURL: "https://api-sepolia.scrollscan.com/api",
            browserURL: "https://sepolia.scrollscan.com/",
          },
        },
      ],
    },
  }
