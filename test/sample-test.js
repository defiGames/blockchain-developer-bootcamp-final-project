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

  
  it("Should update guessCount to one", async function () {

    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    let overrides = {value: ethers.utils.parseEther("0.1")};     // ether in this case MUST be a string

    const setPattern = await greeter.mintGuess([1,1,1,1], overrides);

    await setPattern.wait();
    expect(await greeter.guessCount()).to.equal(1);

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
    for (let i = 0; i<10; i++){
      const setPattern = await greeter.mintGuess([1,1,1,1], overrides);
      await setPattern.wait();
    } 
    expect(await greeter.guessCount()).to.equal(10);
    expect(await greeter.patternTotals(1)).to.equal(10);

  });
});
