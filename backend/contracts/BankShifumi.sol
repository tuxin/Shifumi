// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract BankShifumi is Ownable {   
    
    uint8 public limitRedistribution; 
    uint public limitBet; 
    mapping(address=> bool) public whitelistToken; 

    constructor(uint _limitbet,uint8 _limitRedistribution) payable {
        limitBet=_limitbet;
        limitRedistribution=_limitRedistribution;
    }

    function setLimitBet(uint _limitBet) external onlyOwner{
        require(_limitBet>0, "This limit is not allowed !");
        limitBet =_limitBet ; 
    }

    function setLimitRedistribution(uint8 _limitRedistribution) external onlyOwner{
        require(_limitRedistribution>0, "This limit is not allowed !");
        limitRedistribution =_limitRedistribution ; 
    }

    function getLimitBet() public view returns(uint){
        return limitBet; 
    }

    function getLimitRedistribution() public view returns(uint8){
        return limitRedistribution; 
    }

    function setWhitelistToken(address _tokenAddress) external onlyOwner{
        require(!whitelistToken[_tokenAddress], "This address is already whitelisted !");
        whitelistToken[_tokenAddress] = true;
    }

    function setBlacklistToken(address _tokenAddress) external onlyOwner{
        require(whitelistToken[_tokenAddress], "This address is already blacklisted !");
        whitelistToken[_tokenAddress] = false;
    }

    function getWhitelistToken(address _tokenAddress) public view returns(bool){
        return whitelistToken[_tokenAddress]; 
    }

    function bet(address _token) public view returns(uint) {
       
        uint calculationLimitRedistribution=payable(address(_token)).balance/limitRedistribution;
        require(calculationLimitRedistribution<=limitRedistribution, "This amount is not allowed !");
        return calculationLimitRedistribution;
    }


}