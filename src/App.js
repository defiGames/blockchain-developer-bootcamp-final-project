import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers' 
import Rarity from './artifacts/contracts/Rarity.sol/Rarity.json'

// Update with the contract address logged out to the CLI when it was deployed 
const rarityAddress = "0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c"
let provider 
let signer
let contract 
let accounts
const  numSquares = 9
let  network  

function App() {

  const [savedPatterns, setSavedPatterns] = useState()
  const [msg, setMsg] = useState()
  const [walletStatus, setWalletStatus] = useState("Connect Wallet")
  const [reward, setReward] = useState("0.0")
  const sp = new Array(numSquares).fill(0)
  const [squarePattern, setSquarePattern] = useState(sp)
  const s = new Array(numSquares)
  const [style, setStyle] = useState(s)
  const [patternLimit, setPatternLimit] = useState(0)
  const [address, setAddress] = useState()

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
        network  = await provider.getNetwork()
        signer = provider.getSigner()
        setAddress( await signer.getAddress())
        contract = new ethers.Contract(rarityAddress, Rarity.abi, signer)
        setPatternLimit( await contract.patternLimit())
        console.log(patternLimit.toString())

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
      console.log(network.chainId)  
      if (network.chainId !== 1337){ //change this when deploying
        setMsg("Please connect to correct Network")
        return false
      }
      setWalletStatus("Wallet Connected")
      return true
    } else {
      setWalletStatus("Connect Wallet")
      setAddress("")
      setMsg("Please Connect Wallet")
      return false
    }
  }

  async function submitPattern() {
    if (!walletConnected()) return
    let overrides = {
      value: ethers.utils.parseEther("0.1")     // ether in this case MUST be a string
    }; 
    console.log("send tx: ", squarePattern);
    let transaction;
    try {
      transaction = await contract.submitPattern(squarePattern, overrides)
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
        const data = await contract.fetchPatternIDs()
        let patternText = ""
        if(data.length > 0){
          for (let i = 0; i < data.length; i++) {
            patternText += "Pattern ID " + data[i] + ": "
            const pattern = await contract.fetchPattern(data[i])
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
    if (reward === 0) {
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
    if(receipt.status === 1 && _reward === 0) {
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


  function squareClicked(i){
    const newPattern = squarePattern.slice()
    const newStyle = style.slice()
    if(!newPattern[i]) {
      newPattern[i] = 1
      newStyle[i] = { background : 'grey'}
    }else {
      newPattern[i] = 0
      newStyle[i] = {background : 'white'}
    }
    setStyle(newStyle)
    setSquarePattern(newPattern)
  }

        //<input onChange={e => setPatternValue(e.target.value)} placeholder="Submit Pattern" />
  return (
    <div className="App">
      <div className="topBar">
        <div className="claim">
          <button onClick={claimReward}>Claim Reward</button>
          <span className="reward">Reward: {reward} Eth</span>
        </div>

        <div className="wallet">
          <button onClick={connectWallet}>{walletStatus}</button>
          <div className="address">{address && "..." + address.slice(-5)}</div>
        </div>
      </div>
      <h1 className="Title">The Rarity Game</h1>
      <div className="gameContainer">
        <div className="gameAndButton">
          <div className="game">
            <div className="game-board">
              <div className="board-row">
                <button className="square" style={style[0]} onClick={() =>squareClicked(0)}></button>
                <button className="square" style={style[1]} onClick={() => squareClicked(1)}></button>
                <button className="square" style={style[2]} onClick={() =>squareClicked(2)}></button>
              </div>
              <div className="board-row">
                <button className="square" style={style[3]} onClick={() =>squareClicked(3)}></button>
                <button className="square" style={style[4]} onClick={() =>squareClicked(4)}></button>
                <button className="square" style={style[5]} onClick={() =>squareClicked(5)}></button>
              </div>
              <div className="board-row">
                <button className="square" style={style[6]} onClick={() =>squareClicked(6)}></button>
                <button className="square" style={style[7]} onClick={() =>squareClicked(7)}></button>
                <button className="square" style={style[8]} onClick={() =>squareClicked(8)}></button>
              </div>
            </div>
          </div>

          <button onClick={submitPattern}>Save Pattern</button>
          <div className="App-confirmation">{msg}</div>
        </div>
        <div className="Instructions">Rules: Please create and submit a unique pattern. After the pattern limit of {patternLimit.toString()} patterns is reached,
         each new pattern submission will trigger a burn of the most common pattern submission.
        A submissionn fee of 0.1 Eth is divided up amongst existing active patterns creators.
        The longer your pattern stays active, the more rewards you earn!.
        You can withdraw rewards earned at anytime.
        </div>

      </div>

        <h2 className="app-pattern-title">Your Patterns</h2>
        <div className="app-pattern">{savedPatterns}</div>

    </div>
  );
}

  
export default App
//