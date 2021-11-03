const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

let overrides = {value: ethers.utils.parseEther("0.1")};     // ether in this case MUST be a string
let Greeter;
let greeter;

beforeEach(async function() { 
  Greeter = await ethers.getContractFactory("Greeter");
  greeter = await Greeter.deploy("Hello, world!");
  await greeter.deployed();

  
});

describe("Greeter", function () {

  it("Should return the new pattern id once submitted ", async function () {

    let setPattern = await greeter.mintGuess( [1,0,1,0], overrides);
    await setPattern.wait();
    expect(await greeter.totalPatternCount()).to.equal(1);

  });

  it("it should update rarity", async function () {

    const accounts = await ethers.getSigners();
    const loops = 3;
    /*
    for (let i = 0; i<loops; i++){
      //console.log(accounts[i].address);
      const setPattern = await greeter.connect(accounts[i]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();
    }*/ 
    
      let setPattern = await greeter.connect(accounts[0]).mintGuess( [1,0,1,0], overrides);
      await setPattern.wait();

      setPattern = await greeter.connect(accounts[1]).mintGuess( [0,1,0,1], overrides);
      await setPattern.wait();

      setPattern = await greeter.connect(accounts[2]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();

      setPattern = await greeter.connect(accounts[3]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();
      
      setPattern = await greeter.connect(accounts[4]).mintGuess( [0,0,0,0], overrides);
      await setPattern.wait();
      
      const count = await greeter.liveAddressCount();
      expect(count).to.equal(loops);
      //expect(await greeter.addressList(count-1)).to.equal(accounts[4].address);
      //expect(await greeter.patternTotals(0)).to.equal(3);

    // expect burned id in return?
  });
});
