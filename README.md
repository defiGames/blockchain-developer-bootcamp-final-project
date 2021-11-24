<p align="center">
    <h1 align="center">The Rarity Game</h1>
</p>

## Description
The Rarity Game is a simple blockchain based game played on the Ethereum Blockchain. The objective is to create the most unique pattern. Players who's patterns are not eliminated are rewarded with Eth each time a new pattern is submitted.

  <ul>
    <b>Rules:</b>
    <li>Create and submit a unique pattern by selecing boxes.</li>
    <li>After the limit of patterns is reached, 
    each new pattern submission will trigger a burn of the most common pattern submission</li>
    <li>A pattern submissionn fee in Eth is collected and evenly divided up amongst current patterns</li>
    <li>If a pattern is elimainated, the rewards it has earned remain available, but the pattern will earn no additional rewards</li> 
    <li>Pattern owners can withdraw rewards earned by their patterns at anytime</li> 
    <li>The longer your pattern stays active, the more rewards you earn!</li> 
  </ul>

## Where to play
The Rarity game is deployed on the Ropsten Testnet [here](https://defigames.github.io/blockchain-developer-bootcamp-final-project/). You will need test net Eth to play from a [faucet](https://app.mycrypto.com/faucet)

## Directory Structure
    hardhat.config.js - The entirety of your Hardhat setup (i.e. your config, plugins, and custom tasks) is contained in this file.
    scripts - A folder containing a script named sample-script.js that will deploy your smart contract when executed
    test - A folder containing an example testing script
    contracts - A folder holding an example Solidity smart contract
    scr - A folder containing react node files

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
* [@blaise_eth](https://twitter.com/blaise_eth) on Twitter
* My wallet address is: [BlaisePascal.eth](https://etherscan.io/address/0x3a5b9f815bf2fcb044225ce772ae1bc34a8cdac2)

## References
1. [Facebook's tutorial on deploying a React app to GitHub Pages](https://facebook.github.io/create-react-app/docs/deployment#github-pages-https-pagesgithubcom)
2. [Dabits Guide to Full Stack Ethereum Development](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13)