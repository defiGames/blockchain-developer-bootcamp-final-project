//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;
    struct playerData {
        bool[4] pattern;
        bool burned;
        uint reward;
    }

    mapping(address => playerData ) public players;
    
    address[] addressList;

    uint public patternCount;
    uint[4] public patternTotals;
    uint public guessCount;
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

    function mintGuess(bool[4] memory _pattern) public payable {
        //require that they send ether
        require(msg.value == 0.1 ether);
       // console.log("pattern:", pattern[3]);

       //save the msg senders pattern in the mapping
        players[msg.sender].pattern = _pattern;
        addressList.push(msg.sender);

        //increase the total guesses
        guessCount++;

        //add submitted pattern to pattern totals
        for (uint i = 0; i<4; i++ ){
            patternTotals[i] += _pattern[i] ? 1 : 0;
        } 
        uint lowestRarity;
        address addressToCancel;
        //update data for existing players
        for(uint i = 0; i<guessCount; i++){
            uint _newRarity;
            for(uint j = 0; j<4; j++){
                uint guessComponent =players[addressList[i]].pattern[j] ? 1 : 0;             
                _newRarity += patternTotals[j] - guessCount * guessComponent; 
            }
            if(_newRarity<lowestRarity) {
                addressToCancel = addressList[i];
                lowestRarity = _newRarity;
            }

        }
        players[addressToCancel].burned = true;

        /*
        
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
check if player has the nft
check their balance
transfer the funds
*/