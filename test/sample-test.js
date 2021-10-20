const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    let overrides = {value: ethers.utils.parseEther("0.1")};     // ether in this case MUST be a string
    await setGreetingTx.wait();
    const setPattern = await greeter.mintGuess([1,1,1,1], overrides);

    await setPattern.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");

  });

  it("it should update patternTotals to one", async function () {

    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    let overrides = {value: ethers.utils.parseEther("0.1")};     // ether in this case MUST be a string
    const setPattern = await greeter.mintGuess([1,1,1,1], overrides);

    await setPattern.wait();
    expect(await greeter.patternTotals(3)).to.equal(1);

  });
  it("it should update rarity", async function () {

    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    let overrides = {value: ethers.utils.parseEther("0.1")};     // ether in this case MUST be a string
    const loops = 5;
    
    const accounts = await ethers.getSigners();
    
    /*
    for (let i = 0; i<loops; i++){
      //console.log(accounts[i].address);
      const setPattern = await greeter.connect(accounts[i]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();
    }*/ 
    
      let setPattern = await greeter.connect(accounts[0]).mintGuess( [1,0,1,0], overrides);
      await setPattern.wait();
      
      setPattern = await greeter.connect(accounts[1]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();

      setPattern = await greeter.connect(accounts[2]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();

      setPattern = await greeter.connect(accounts[3]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();
      
      setPattern = await greeter.connect(accounts[4]).mintGuess( [1,1,1,1], overrides);
      await setPattern.wait();
      
    expect(await greeter.totalPatternCount()).to.equal(loops);
    // expect burned id in return?
  });
});
