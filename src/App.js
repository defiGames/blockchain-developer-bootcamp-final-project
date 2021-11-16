import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers' 
import Rarity from './artifacts/contracts/Rarity.sol/Rarity.json'

// Update with the contract address logged out to the CLI when it was deployed 
const rarityAddress = "0x7A9Ec1d04904907De0ED7b6839CcdD59c3716AC9"
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

  useEffect(() => {
    initialize()
  },[])
  
  async function connectWallet() {
    if(walletConnected())return
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      initialize()
  }
  
  async function initialize() {
    if (window.ethereum) {
      try {
        //console.log("initializing")
        accounts = await window.ethereum.request({ method: 'eth_accounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner()
        address = await signer.getAddress()
        contract = new ethers.Contract(rarityAddress, Rarity.abi, signer)

        const eventFilter = contract.filters.newPattern(address, null)
        
        //set event listener
        contract.on(eventFilter, (  metadata, event) => {
          console.log('Address  :', metadata);
          console.log('Pattern Id : ', event.toString());  //Event object
          setMsg(`Pattern ID No. ${event.toString()} has been submitted!`)
          refreshAccount()
        });
        
      } catch (err) {
        console.log("Error connecting Wallet: "+ err.message)
        setMsg("Please Connect Wallet")
        return false
      }
      refreshAccount()
    } else {
      setMsg("Please install Metamask")
      return false
    }
  }

  function refreshAccount() { 
      fetchPatterns()
      checkReward()
  }

  function walletConnected() {
    if (window.ethereum && accounts && accounts.length > 0) {
      setWalletStatus("Wallet Connected")
      return true
    } else {
      setWalletStatus("Connect Wallet")
      setMsg("Please Connect Wallet")
      return false
    }
  }

  async function submitPattern() {
    if (!walletConnected()) return
    if (!pattern || pattern.length !== 4) {
      setMsg("please enter the correct amount of digits")
      return
    }
    let overrides = {
      value: ethers.utils.parseEther("0.1")     // ether in this case MUST be a string
    }; 
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
    /* Instead of using a receipt we are listening for the event now
    const receipt = await transaction.wait()
    if(receipt.status === 1) {
      setMsg("Pattern submission sucessful!")
    } else {
      setMsg("There was an error submitting your pattern, please try again")
      return false;
    }
    */
  }
  
  async function fetchPatterns() {
    if (!walletConnected()) return
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
        setMsg(err)
      }
  }

  async function claimReward() {
    if (!walletConnected()) return
    if (reward == 0) {
      setMsg("No Reward to Claim")
      return
    }
    let claim
    try {
    claim = await contract.claimReward();
    } catch (err) {
      setMsg(err.message)
      return false
    }
    setMsg("Tx Pending")
    const receipt = await claim.wait()
    //wait for transaction to finish
    //check the reward amount, update msg, check that reward is zeroed out
    const _reward = await checkReward() 
    if(receipt.status === 1 && _reward == 0) {
      setMsg(reward + " Eth Reward Claimed Sucessfully")
    } else {
      setMsg("There was an error, please try again")
      return false;
    }
  }

  async function checkReward() {
    if (!walletConnected()) return
    try {
      const _reward = ethers.utils.formatEther(await contract.checkReward())
      const res = (+_reward).toFixed(2);
      setReward(res)
      return _reward
    } catch (err) {
      setMsg(err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Instructions">Please Enter a 4 digit Pattern of 1s and 0s</div>
        <input onChange={e => setPatternValue(e.target.value)} placeholder="Submit Pattern" />
        <button onClick={submitPattern}>Save Pattern</button>
        <div className="App-confirmation">{msg}</div>
        <div className="app-pattern-title">Your Patterns</div>
        <div className="app-pattern">{savedPatterns}</div>
        <button onClick={claimReward}>Claim Reward</button>
        <div className="app-claim">Reward: {reward} Eth</div>
        <button onClick={connectWallet}>{walletStatus}</button>
     </header>
    </div>
  );
}

  
export default App
//