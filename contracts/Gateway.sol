// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Gateway {
  address payable owner;
  address payable payee;
  mapping (address=>uint) addressToAmount;

  constructor(){
    owner = payable(msg.sender);
  }

 function payToContract(uint amount) public payable {
   require(msg.value>=amount, "Insufficient value");
   addressToAmount[msg.sender] += msg.value;
 }

 function withdraw(uint amount) public payable {
   require(msg.sender == owner);
   require(address(this).balance>=amount);

   owner.transfer(amount);
 }

 function verifyTransaction(uint amount)public view returns(bool){
   return addressToAmount[msg.sender]>=amount;
 }

  function getAddress() public view returns(address){
    return msg.sender;
  }

  receive() external payable{
   addressToAmount[msg.sender] += msg.value;
  }
}
