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
    
    address[] public addressList;

    uint constant squares = 4;
    uint public totalPatternCount;
    uint[squares] public patternTotals;
    uint public patternLimit = 3;
    uint public liveAddressCount; 
    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function mintGuess(bool[squares] memory _pattern) public payable {
        //require that they send ether
        require(msg.value == 0.1 ether);
        //console.log("pattern:", _pattern[3]);

       //save the msg senders pattern in the mapping
        players[msg.sender].pattern = _pattern;
        addressList.push(msg.sender);

        //increase the total guesses
        totalPatternCount++;
        liveAddressCount++;

        //add submitted pattern to pattern totals
        for (uint i = 0; i<squares; i++ ){
            patternTotals[i] += _pattern[i] ? 1 : 0;
        } 

        //find a burn most common pattern holder
        address addressToCancel = msg.sender; //default address to burn is the newest
        uint lowestRarity = squares * patternLimit;

       //burn most rare by looping through all patterns
        for(uint i = 0; i<totalPatternCount; i++){
            console.log("\nLOOP: %s",i);
            //playerData player = players[addressList[i]];
            //skip burned addresses
            if(players[addressList[i]].burned) continue;

            //calculate rarity by comparing each pattern component to the avg
            uint _rarity;
            uint[8] memory debug;

            for(uint j = 0; j<squares; j++){
                uint patternComponent =players[addressList[i]].pattern[j] ? 1 : 0;             
                uint inflatedPattern = liveAddressCount * patternComponent; 
                _rarity += inflatedPattern > patternTotals[j] ? inflatedPattern - patternTotals[j] : patternTotals[j] - inflatedPattern; 

                debug[j] = inflatedPattern;
                debug[j+4] = patternTotals[j];
            }

                console.log(addressList[i]);
                console.log(debug[0], debug[1], debug[2], debug[3] );
                console.log(debug[4], debug[5], debug[6], debug[7] );
                console.log("old ratity: %s " , lowestRarity);
                console.log("new rarity %s ", _rarity);
            //save the loswest rarity address for burn if we are over limit
            if(_rarity < lowestRarity ) {
                addressToCancel = addressList[i];
                lowestRarity = _rarity;
            }

        }
        //if we are over the limit, burn address
        if( liveAddressCount > patternLimit) {
            players[addressToCancel].burned = true;
            liveAddressCount--;

            //remove burned patterns from totals
            for (uint j = 0; j<squares; j++ ){
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