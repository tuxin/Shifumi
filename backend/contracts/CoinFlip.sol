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

    address bankAddress;
    uint8 multiplicator;

    constructor(address _address) {
        bankAddress=_address;
        multiplicator=18;
    }

    // ** SETTER ** //
    /// @notice Set the multiplicator
    /// @dev Set the multiplicator in uint8 >0
    /// @param _multiplicator in uint8 >0
    function setMultiplicator(uint8 _multiplicator) external onlyOwner{
        require(_multiplicator>0, "This limit is not allowed");
        multiplicator = _multiplicator ; 
    }

    // ** GETTER ** //
    /// @notice get the multiplicator
    /// @dev get an uint. 
    /// @param _numbers numbers but its genereic parameter. 
    /// @return multiplicator the multuplicator
    function getMultiplicator(uint8[] memory _numbers) public view returns (uint){
        return multiplicator;
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