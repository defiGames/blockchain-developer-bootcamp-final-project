<p align="center">
    <h1 align="center">The Rarity Game</h1>
</p>

## Description
 This Dapp will create a collection of NFTs that will be used in The Rarity Game. Each players goal is to mint the most unique NFT pattern possible by selecting points in a grid. After 100 NFTS have been minted, the most common design will be burned each time a new NFT is minted. Players are incentiviced to create the most unique and therefore long lasting pattern through a minting fee distribution. Each new mint price increases slightly and is distributed evenly amongst the existing NFT holders' wallets.

## Where to play
The Rarity game is deployed on the Ropsten Testnet [here](). You will need test net Eth to play from a [faucet](https://app.mycrypto.com/faucet)

## Directory Structure
    hardhat.config.js - The entirety of your Hardhat setup (i.e. your config, plugins, and custom tasks) is contained in this file.
    scripts - A folder containing a script named sample-script.js that will deploy your smart contract when executed
    test - A folder containing an example testing script
    contracts - A folder holding an example Solidity smart contract

## Run locally

```bash
# Install dependencies
npx create-react-app react-dapp
# In the new directory:
npm install ethers hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers

# Initialize a new Hardhat Dev env
npx hardhat

# open hardhat.config.js and update the module.exports to look like this:
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};

# To deploy to the local network, you first need to start the local test node. To do so, open the CLI and run the following command:
npx hardhat node

# Update deploy script name
mv scripts/sample-script.js scripts/depoy.js

# Deploy on local network
npx hardhat run scripts/deploy.js --network localhost

# Import Private key into Metamask and change MetaMask to use localhost 8545

# Open src/App.js and update the value of rarityAddress with the address of your deployed smart contract
const rarityAddress = "your-contract-address"

# Start the React server
npm start

# Running uint tests
npx hardhat test
```
## Contact
[@blaise_eth](https://twitter.com/blaise_eth) on Twitter
My wallet address is: [BlaisePascal.eth](https://etherscan.io/address/0x3a5b9f815bf2fcb044225ce772ae1bc34a8cdac2)

## References
1. [Facebook's tutorial on deploying a React app to GitHub Pages](https://facebook.github.io/create-react-app/docs/deployment#github-pages-https-pagesgithubcom)
2. [Dabits Guide to Full Stack Ethereum Development] (https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13)