//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;
    mapping(address => bool[4] ) public patterns;
    uint patternCount;
    uint[4] patternTotals;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }

    function mintGuess(bool[4] memory pattern) public {
        console.log("Ran mintGuess");
        console.log(pattern[0]);
        console.log("pattern:", pattern[0]);
        //convert string to bool array

/*
        reqiure(msg.value == 0.1 ether);

        patterns[msg.sender] = boolPattern;
        guessCount++;
        updateTotalGuesses();
        
        if we are at limit
        updateRarity();
        drop most common
        
        updateRewards

*/

    }
}
/*
mint NFT with pattern
check if we are at limit
check value
update grid totals
calculate closest match by multiplying each box by total number of nfts then 
    subtract from grid totals, add the abs of the diffs
boot the most common
distribute fee
update fee
update nft count

claim fee function:
check if user has the nft
check their balance
transfer the funds
*/