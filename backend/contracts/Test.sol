// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import "./BankShifumi.sol";

abstract contract TestContract is BankShifumi  { 

    function _sendPayout(address _gameContract,address _token,bool _result) public{

        Bet memory betInProgress;
        
        uint256 winningAmount;

        betInProgress.modulo=1;
        betInProgress.randomNumber=1 ;
        betInProgress.randomWords=new uint256[](0);
        betInProgress.result=new uint256[](1);
        betInProgress.gameAddress=_gameContract;
        betInProgress.tokenAddress=_token;
        betInProgress.playerAddress=msg.sender;
        betInProgress.numbers[0]=1;
        betInProgress.multiplier=18;
        betInProgress.amount=1;
        betInProgress.id=1;
        betInProgress.maxRound=1 ;
        betInProgress.winningRound=1;
        betInProgress.tokenName="NAME";
                 
        //sendPayout(betInProgress,_result,winningAmount);
    }
}