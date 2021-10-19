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
    await setGreetingTx.wait();
      let overrides = {
        value: ethers.utils.parseEther("0.1")     // ether in this case MUST be a string
      }; 
    const setPattern = await greeter.mintGuess([1,1,1,1], overrides);

    await setPattern.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");

  });

  
  it("Should update guessCount to one", async function () {

    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

      let overrides = {
        value: ethers.utils.parseEther("0.1")     // ether in this case MUST be a string
      }; 
    const setPattern = await greeter.mintGuess([1,1,1,1], overrides);

    await setPattern.wait();
    expect(await greeter.guessCount()).to.equal(1);

  });
});
