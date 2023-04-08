// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

/// @title Contract to manage CoinFlip
/// @author Dauge Damien @Tuxiiin
/// @notice You can use this contract to implement a gambling app
/// @dev All function calls are currently implemented without side effects

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CoinFlip is Ownable,Pausable  {   

    uint8 modulo = 2;
    uint8 multiplicator;
    uint8 randomNumber;
    uint8 maxRound;
    uint8 winningRound;
    string name;
    address bankAddress;
    

    constructor(address _address,uint8 _multiplicator,uint8 _randomNumber,uint8 _maxround,uint8 _winninground,string memory _name) {
        bankAddress=_address;
        multiplicator=_multiplicator;
        randomNumber=_randomNumber;
        name=_name;
        maxRound=_maxround;
        winningRound=_winninground;
    }

    // ** SETTER ** //
    /// @notice Set the multiplicator
    /// @dev Set the multiplicator in uint8 >0
    /// @param _multiplicator in uint8 >0
    function setMultiplicator(uint8 _multiplicator) external onlyOwner{
        require(_multiplicator>0, "This number is not allowed");
        multiplicator = _multiplicator ; 
    }

    /// @notice Set the random number
    /// @dev Set how many random number we need in uint8 >0
    /// @param _randomNumber in uint8 >0
    function setRandomNumber(uint8 _randomNumber) external onlyOwner{
        require(_randomNumber>0, "This number is not allowed");
        randomNumber = _randomNumber ; 
    }

    /// @notice Set the _maxRound
    /// @dev Set how maxRound we need in uint8 >0
    /// @param _maxRound in uint8 >0
    function setMaxRound(uint8 _maxRound) external onlyOwner{
        require(_maxRound>0, "This number is not allowed");
        maxRound = _maxRound ; 
    }

    /// @notice Set the _winningRound
    /// @dev Set how many _winningRound we need in uint8 >0
    /// @param _winningRound in uint8 >0
    function setWinningRound(uint8 _winningRound) external onlyOwner{
        require(_winningRound>0, "This number is not allowed");
        winningRound = _winningRound ; 
    }

    // ** GETTER ** //
    /// @notice get the multiplicator
    /// @dev get an uint. 
    /// @param _numbers numbers but its genereic parameter. 
    /// @return multiplicator the multuplicator
    function getMultiplicator(uint8[] memory _numbers) public view returns (uint){
        
        uint multiplicatorcalculate;

        if (_numbers.length==0){
            multiplicatorcalculate=0;
        }

        if (_numbers.length==1){
            multiplicatorcalculate=multiplicator;
        }

        if (_numbers.length>1){
            multiplicatorcalculate=1;
        }

        return multiplicatorcalculate;
    }

    /// @notice get the number of random number
    /// @dev get an uint. 
    /// @return randomNumber; have many random number
    function getRandomNumber() public view returns (uint){
        return randomNumber;
    }

    /// @notice get the number of maxRound
    /// @dev get an uint. 
    /// @return maxRound; have many maxRound
    function getMaxRound() public view returns (uint){
        return maxRound;
    }

    /// @notice get the number of winningRound
    /// @dev get an uint. 
    /// @return winningRound; have many winningRound
    function getWinningRound() public view returns (uint){
        return winningRound;
    }

    /// @notice get the name of game
    /// @dev get a string. 
    /// @return name name of the game
    function getGameName() public view returns (string memory){
        return name;
    }

    /// @notice get the modulo
    /// @dev get an uint8. 
    /// @return modulo have many random number
    function getModulo() public view returns (uint8){
        return modulo;
    }


    // MAIN
    /// @notice Pause or unpause the contract
    /// @dev Pause or unpause the contract with the openzeppeling contract
    function pause() external onlyOwner {
        if (paused()) {
            _unpause();
        } else {
            _pause();
        }
    }
    
}