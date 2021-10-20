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

    uint public totalPatternCount;
    uint[4] public patternTotals;
    uint public patternLimit = 3;
    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function mintGuess(bool[4] memory _pattern) public payable {
        //require that they send ether
        require(msg.value == 0.1 ether);
        //console.log("pattern:", _pattern[3]);

       //save the msg senders pattern in the mapping
        players[msg.sender].pattern = _pattern;
        addressList.push(msg.sender);

        //increase the total guesses
        totalPatternCount++;

        //add submitted pattern to pattern totals
        for (uint i = 0; i<4; i++ ){
            patternTotals[i] += _pattern[i] ? 1 : 0;
        } 

        //find a burn most common pattern holder
        address addressToCancel = msg.sender; //default address to burn is the newest
        uint liveAddressCount; 
        uint lowestRarity = 4 * patternLimit;

       //burn most rare by looping through all patterns
        for(uint i = 0; i<totalPatternCount; i++){
            console.log("\nLOOP: %s",i);
            //playerData player = players[addressList[i]];
            //skip burned addresses
            if(players[addressList[i]].burned) continue;
            liveAddressCount++;

            //calculate rarity by comparing each pattern component to the avg
            uint _rarity;
            for(uint j = 0; j<4; j++){
                uint patternComponent =players[addressList[i]].pattern[j] ? 1 : 0;             
                uint inflatedPattern = liveAddressCount * patternComponent; 
                _rarity = inflatedPattern > patternTotals[j] ? inflatedPattern - patternTotals[j] : patternTotals[j] - inflatedPattern; 
            }
                console.log(addressList[i]);
                console.log("lowest rarity %s", lowestRarity);
                console.log("new rarity %s", _rarity);
            //save the loswest rarity address for burn if we are over limit
            if(_rarity < lowestRarity ) {
                addressToCancel = addressList[i];
                lowestRarity = _rarity;
            }

        }
        //if we are over the limit, burn address
        if( liveAddressCount > patternLimit) {
            players[addressToCancel].burned = true;
            for (uint j = 0; j<4; j++ ){
                patternTotals[j] -= players[addressToCancel].pattern[j] ? 1 : 0;
            } 
            
            console.log("address to cancel: %s", addressToCancel);
        }
        //  updateRewards
    }

    function abs(int x) private pure returns (uint) {
        return uint(x >= 0 ? x : -x);
    } 

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
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