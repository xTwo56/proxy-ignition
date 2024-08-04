// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Maps {
  address owner;

  constructor(){
    owner = msg.sender;
  }

  function getAddress() public view returns(address){
    return msg.sender;
  }
}
