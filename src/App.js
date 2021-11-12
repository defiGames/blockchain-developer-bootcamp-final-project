import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers' 
import Rarity from './artifacts/contracts/Rarity.sol/Rarity.json'

// Update with the contract address logged out to the CLI when it was deployed 
const rarityAddress = "0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154"
  let provider 
  let signer
  let contract 
  let accounts
  let address
function App() {

  const [pattern, setPatternValue] = useState()
  const [savedPatterns, setSavedPatterns] = useState()
  const [msg, setMsg] = useState()
  const [walletStatus, setWalletStatus] = useState("Connect Wallet")
  const [reward, setReward] = useState()
  //load account info on page load of request wallet connection
  useEffect(() => {
    isMetaMaskConnected() 
//function here to initialize, other function should 
    checkReward()
    fetchPatterns()
  },[])
  
  // request access to the user's MetaMask account

  async function isMetaMaskConnected() {
    if (window.ethereum) {
      //maybe try accounts here and return if good
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner()
        address = await signer.getAddress()
        contract = new ethers.Contract(rarityAddress, Rarity.abi, signer)
        accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const filter = contract.filters.newPattern(address, 5)
        contract.on(filter, (  metadata, event) => {
        console.log('Address  :', metadata);
        console.log('Pattern Id : ', event.toString());  //Event object
    });
      } catch (err) {
        setMsg("Error connecting Wallet: "+ err.message)
        return false
      }
      if (accounts.length > 0) {
        setWalletStatus("Wallet Connected")
      } else {
        setWalletStatus("Connect Wallet")
      }
    } else {
      setMsg("Please install Metamask")
      return false
    }
  }

  async function checkReward() {
    if (!isMetaMaskConnected()) return
    try {
      const _reward = ethers.utils.formatEther(await contract.checkReward())
      setReward(`Reward: ${_reward} Eth`)
    } catch (err) {
      console.log("Error: ", err)
    }
    setMsg("")
  }

  // call the smart contract, read the current pattern id
  async function confirmation() {

    if (!isMetaMaskConnected()) return
      try {
        const data = String(await contract.totalPatternCount())
        setMsg(`Pattern ID No. ${data-1} has been submitted!`)
      } catch (err) {
        console.log("Error: ", err)
      }
        
  }

  async function fetchPatterns() {

    if (!isMetaMaskConnected()) return

      try {
        const data = await contract.fetchPatternID()
        let patternText = ""
        if(data.length > 0){
          for (let i = 0; i < data.length; i++) {
            patternText += "Pattern ID " + data[i] + ": "
            const pattern = await contract.fetchPatterns(data[i])
            patternText += pattern 
            const active = await contract.patternIsActive(data[i])
            patternText += active ?  " -Active" :  " -Inactive" 
            patternText += "\n"
          }
          setSavedPatterns(patternText) 
        } else {
          setSavedPatterns("No Patterns Found")
        }

      } catch (err) {
        console.log("Error: ", err)
      }
  }

  async function submitPattern() {
    if (!pattern || pattern.length !== 4) {
      setMsg("please enter the correct amount of digits")
      return
    }
    let overrides = {
      value: ethers.utils.parseEther("0.1")     // ether in this case MUST be a string
    }; 
    if (!isMetaMaskConnected()) return
    console.log("sending tx");
    let transaction;
    try {
      transaction = await contract.mintGuess([parseInt(pattern[0]),parseInt(pattern[1]),parseInt(pattern[2]),parseInt(pattern[3]),], overrides)
      console.log("send tx");
    } catch (err) {
      setMsg(err.message)
      return false
    }
    setMsg("Tx Pending")
    const receipt = await transaction.wait()
    if(receipt.status === 1) {
      setMsg("Pattern submission sucessful!")
    } else {
      setMsg("There was an error submitting your pattern, please try again")
      return false;
    }
    //const gasUsed = receipt.status;
    console.log(receipt.status);
    fetchPatterns()
    checkReward()
    confirmation()
  
  }
  
  async function claimReward() {
    if (!isMetaMaskConnected()) return
    let claim
    try {
    claim = await contract.claimReward();
    } catch (err) {
      setMsg(err.message)
      return false
    }
    setMsg("Tx Pending")
    const receipt = await claim.wait()
    await checkReward() 

    if(receipt.status === 1) {
      setMsg("Reward Claimed Sucessfully")
    } else {
      setMsg("There was an error, please try again")
      return false;
    }
  
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Instructions">Please Enter a 4 digit Pattern of 1s and 0s</div>
        <input onChange={e => setPatternValue(e.target.value)} placeholder="Submit Pattern" />
        <button onClick={submitPattern}>Save Pattern</button>
        <div className="App-confirmation">{msg}</div>
        <button onClick={fetchPatterns}>View My Patterns</button>
        <div className="app-pattern">{savedPatterns}</div>
        <button onClick={claimReward}>Claim Reward</button>
        <div className="app-claim">{reward}</div>
        <button onClick={isMetaMaskConnected}>{walletStatus}</button>
     </header>
    </div>
  );
}

  
export default App
//