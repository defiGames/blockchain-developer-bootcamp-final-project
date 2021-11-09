//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {

    uint constant squares = 4;

    struct playerData {
        uint reward;
        uint[] patternId;
    }

    mapping(address => playerData ) public players;

    struct patternStruct {
        uint[squares] pattern;
        bool burned;
        address creator;
    }

    patternStruct[] public patterns;
    
    uint public totalPatternCount;
    uint[squares] public patternTotals;
    uint public patternLimit = 3;
    uint public liveAddressCount; 
    uint public fee = 0.1 ether;

    constructor(string memory _greeting) {
    }

    function mintGuess(uint[squares] memory _pattern) public payable returns (uint) {
        //require that they send ether
        require(msg.value == fee, "please send ether");
        //console.log("pattern:", _pattern[3]);

       //save the msg senders pattern in the mapping
        patterns.push(patternStruct(_pattern, false, msg.sender));
        players[msg.sender].patternId.push(totalPatternCount);

        //increase the total guesses
        liveAddressCount++;
        totalPatternCount++;

        //add submitted pattern to pattern totals
        for (uint i = 0; i<squares; i++ ){
            require(_pattern[i] < 2, "Please enter only 1 and 0");
            patternTotals[i] += _pattern[i];
        } 

        //find a burn most common pattern holder
        uint idToCancel = patterns.length - 1; //default address to burn is the newest
        uint lowestRarity = squares * patternLimit; //default lowest rarity is highest possible

       //burn most rare by looping through all patterns
        for(uint i = 0; i<patterns.length; i++){
            console.log("\nLOOP: %s",i);
            //playerData player = players[addressList[i]];
            //skip burned addresses
            if(patterns[i].burned) continue;

            //calculate rarity by comparing each pattern component to the avg
            uint _rarity;
            uint[8] memory debug;

            for(uint j = 0; j<squares; j++){
                uint patternComponent =patterns[i].pattern[j];             
                uint inflatedPattern = liveAddressCount * patternComponent; 
                _rarity += inflatedPattern > patternTotals[j] ? inflatedPattern - patternTotals[j] : patternTotals[j] - inflatedPattern; 

                debug[j] = inflatedPattern;
                debug[j+4] = patternTotals[j];
            }

                //console.log(addressList[i]);
                console.log(debug[0], debug[1], debug[2], debug[3] );
                console.log(debug[4], debug[5], debug[6], debug[7] );
                console.log("old ratity: %s " , lowestRarity);
                console.log("new rarity %s ", _rarity);
            //save the loswest rarity address for burn if we are over limit
            if(_rarity < lowestRarity ) {
                idToCancel = i;
                lowestRarity = _rarity;
            }

        }
        //if we are over the limit, burn address
        if( liveAddressCount > patternLimit) {
            patterns[idToCancel].burned = true;
            liveAddressCount--;

            //remove burned patterns from totals
            for (uint j = 0; j<squares; j++ ){
                patternTotals[j] -= patterns[idToCancel].pattern[j];
            } 
            
            console.log("pattern to cancel: %s", idToCancel);
        }

        //  updateRewards
        for(uint i = 0; i<patterns.length; i++){
            if(patterns[i].burned ) continue; //no fee if you just submitted. This portion will accummulte in the contract if not burned which will help the contract not become negative due to rounding error
            address _address = patterns[i].creator;
            players[_address].reward += fee/liveAddressCount;
            console.log("rewarding: %s", players[_address].reward);
            console.log("Address: %s", _address);
        } 

        return totalPatternCount-1;
    }

    function checkReward() public view returns (uint) {
        return (players[msg.sender].reward);
        console.log("CheckReward %s", players[msg.sender].reward);

    }

    function claimReward() public payable {
        uint _reward = players[msg.sender].reward;
        require(_reward > 0, "No reward to claim");
        players[msg.sender].reward = 0;
        (bool sent, bytes memory data) = msg.sender.call{value: _reward}("");
        require(sent, "Failed to claim Reward");
    }

    function fetchPatternID() public view returns (uint[] memory){
        return (players[msg.sender].patternId);
    }

    function patternIsActive(uint id) public view returns(bool){
        return (!patterns[id].burned);
    }
       function fetchPatterns(uint id) public view returns(uint[squares] memory){
        return (patterns[id].pattern);
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