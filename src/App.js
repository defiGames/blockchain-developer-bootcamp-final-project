import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers' 
import ReactDOM from "react-dom";
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

// Update with the contract address logged out to the CLI when it was deployed 
const greeterAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"
function App() {
  // store pattern in local state
  const [pattern, setPatternValue] = useState()
  const [patternNo, setPatternNo] = useState()
  const [pending, setPending] = useState()
  const [hidden, setHidden] = useState()

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current pattern value
  async function fetchPattern() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = String(await contract.totalPatternCount())
        setPending(`Pattern ID No. ${data-1} has been submitted!`)
        console.log('data: ', data)
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
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction2 = await contract.mintGuess([parseInt(pattern[0]),parseInt(pattern[1]),parseInt(pattern[2]),parseInt(pattern[3]),], overrides)
      console.log(Boolean(parseInt(pattern[0])))
      console.log("raw" + pattern[0])
      setPending("Tx Pending")
      setHidden(false)
      await transaction2.wait()
      fetchPattern()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-confirmation"  style={{ display: hidden ? "none" : "block"   }}>
          {pending}
        </div>
        <input onChange={e => setPatternValue(e.target.value)} placeholder="Submit Pattern" />
        <button onClick={submitPattern}>Set Pattern</button>
        <button onClick={fetchPattern}>Fetch Pattern</button>
      </header>
    </div>
  );
}

export default App
//