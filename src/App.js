import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers' 
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

// Update with the contract address logged out to the CLI when it was deployed 
const greeterAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
function App() {
  // store pattern in local state
  const [pattern, setPatternValue] = useState()
  const [savedPatterns, setSavedPatterns] = useState()
  const [msg, setMsg] = useState()
  const [walletStatus, setWalletStatus] = useState("Connect Wallet")

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
  }

  // call the smart contract, read the current pattern value
  async function confirmation() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
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
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.fetchPatternID()
        let patternText = ""
        if(data.length > 0){
          for (let i = 0; i < data.length; i++) {
            patternText += "Pattern ID " + data[i] + ": "
            const pattern = await contract.fetchPatterns(data[i])
            patternText += pattern + "\n\r" 
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

  // call the smart contract, send an update
  async function submitPattern() {
    if (!pattern) return
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
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction2 = await contract.mintGuess([parseInt(pattern[0]),parseInt(pattern[1]),parseInt(pattern[2]),parseInt(pattern[3]),], overrides)
      console.log(Boolean(parseInt(pattern[0])))
      console.log("raw" + pattern[0])
      setMsg("Tx Pending")
      await transaction2.wait()
      confirmation()
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <div className="App-confirmation"  >
          {msg}
        </div>
        <input onChange={e => setPatternValue(e.target.value)} placeholder="Submit Pattern" />
        <button onClick={submitPattern}>Set Pattern</button>
        <button onClick={fetchPatterns}>Fetch Pattern</button>
         <button onClick={requestAccount}>{walletStatus}</button>
        <div className="App-Pattern"  >
          {savedPatterns}
        </div>
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