import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers' 
import Rarity from './artifacts/contracts/Rarity.sol/Rarity.json'

// Update with the contract address logged out to the CLI when it was deployed 
const rarityAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"
function App() {

  const [pattern, setPatternValue] = useState()
  const [savedPatterns, setSavedPatterns] = useState()
  const [msg, setMsg] = useState()
  const [walletStatus, setWalletStatus] = useState("Connect Wallet")
  const [reward, setReward] = useState()

  //load account info on page load of request wallet connection
  useEffect(() => {
    console.log("mounted")
    requestAccount()
  },[])
  
  // request access to the user's MetaMask account
  async function requestAccount() {
    setMsg("")
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) {
      setMsg("Error connecting Wallet: "+ err.message)
      return false
    }
    console.log("connected")
    setWalletStatus("Wallet Connected")
    checkReward()
    fetchPatterns()
  }

  async function checkReward() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(rarityAddress, Rarity.abi, provider)
      try {
        const _reward = ethers.utils.formatEther(await contract.checkReward())
        setReward(`Reward: ${_reward} Eth`)
        console.log('data: ', _reward)
      } catch (err) {
        console.log("Error: ", err)
      }
      setMsg("")
    }    
  }

  // call the smart contract, read the current pattern id
  async function confirmation() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(rarityAddress, Rarity.abi, provider)
      try {
        const data = String(await contract.totalPatternCount())
        setMsg(`Pattern ID No. ${data-1} has been submitted!`)
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function fetchPatterns() {
    if (typeof window.ethereum !== 'undefined') {

      const connected =  await isMetaMaskConnected()
      if (!connected) {
          // metamask is not connected
          setMsg("Please Connect Wallet")
          return
      } 

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(rarityAddress, Rarity.abi, provider)

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

        console.log('data: ', data[0])
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function submitPattern() {
    if (pattern.length !== 4) {
      setMsg("please enter the correct amount of digits")
      return
    }
    if (typeof window.ethereum !== 'undefined') {
      let overrides = {
        value: ethers.utils.parseEther("0.1")     // ether in this case MUST be a string
      }; 
    
      const connected =  await isMetaMaskConnected()
      if (!connected) {
          // metamask is not connected
          setMsg("Please Connect Wallet")
          return
      } 

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(rarityAddress, Rarity.abi, signer)
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
  }
  
  async function claimReward() {
    if (typeof window.ethereum !== 'undefined') {
      
      const connected =  await isMetaMaskConnected()
      if (!connected) {
          // metamask is not connected
          setMsg("Please Connect Wallet")
          return
      } 

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const rarity = new ethers.Contract(rarityAddress, Rarity.abi, signer)
      let claim
      try {
      claim = await rarity.claimReward();
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
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Instructions">Please Enter a 4 digit Pattern of 1s and 0s</div>
        <input onChange={e => setPatternValue(e.target.value)} placeholder="Submit Pattern" />
        <button onClick={submitPattern}>Save Pattern</button>
        <div className="App-confirmation">{msg}</div>
        <button onClick={fetchPatterns}>View My Patterns</button>
        <div classname="app-pattern">{savedPatterns}</div>
        <button onClick={claimReward}>Claim Reward</button>
        <div classname="app-claim">{reward}</div>
        <button onClick={requestAccount}>{walletStatus}</button>
     </header>
    </div>
  );
}

const isMetaMaskConnected = async () => {
  //const accounts = await provider.listAccounts();   
  //const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts.length > 0;
}
  
export default App
//