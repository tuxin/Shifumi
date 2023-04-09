// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

/// @title Contract to manage bank and bet 
/// @author Dauge Damien @Tuxiiin
/// @notice You can use this contract to implement a gambling app
/// @dev All function calls are currently implemented without side effects

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract StakingShifumi is Ownable,Pausable,ReentrancyGuard   {   

    uint256 private balances;
    uint256 private feesclaimable;
    address private bankAddress;
    address private tokenAddress;
    

    mapping(address=> uint256) public stakersBalances; 
    mapping(address=> bool) public isStakers; 
    address[] public stakersAddress;

    using SafeMath for uint256;
    
    constructor(address _bankaddress,address _tokenAddress) {
        bankAddress = _bankaddress;
        tokenAddress = _tokenAddress;
    }

    modifier onlyBankAddress { 
      require(msg.sender == bankAddress || msg.sender==owner(),"Only bankaddress");
      _;
   }

   event Staking(string _type,address _address,uint256 _amount,uint256 _timestamp);

    // ** GETTER ** //
    /// @notice Return the bankAddresss
    /// @dev Returns bankAddress address.
    /// @return bankAddress in address
    function getBankAddress() public view returns(address){
        return bankAddress; 
    }

    /// @notice Return the tokenAddress
    /// @dev Returns tokenAddress address.
    /// @return tokenAddress in address
    function getTokenAddress() public view returns(address){
        return tokenAddress; 
    }

    /// @notice Return the total of balances
    /// @dev Returns a balance uint.
    /// @return balances in uint8
    function getBalances() public view returns(uint){
        return balances; 
    }

    /// @notice Return the user balance
    /// @dev Returns a balance uint.
    /// @return _address in uint8
    function getUserBalance(address _address) public view returns(uint){
        return stakersBalances[_address]; 
    }

    /// @notice Return the total of feesclaimable
    /// @dev Returns a feesclaimable uint.
    /// @return feesclaimable in uint8
    function getFeesclaimable() public view returns(uint){
        return feesclaimable; 
    }

    // ** SETTER ** //
    /// @notice Set the bankAddress
    /// @dev Set the bankAddress
    /// @param _address in address
    function setBankAddress(address _address) external onlyOwner{
        require(_address!=address(0), "This address is not allowed");
        bankAddress = _address ; 
    }


    // MAIN
    /// @notice Set the balances
    /// @dev Set the balances, feesclaimable and staker balances
    /// @param _amount in uint
    function addFees(uint256 _amount) external onlyBankAddress{
        require(_amount>0, "This amount is not allowed");
        balances = balances.add(_amount) ; 
        feesclaimable = feesclaimable.add(_amount) ; 
 
        uint256 feesamount;
        uint256 proportion;
        for (uint i = 0; i < stakersAddress.length; i++) {
            proportion = (stakersBalances[stakersAddress[i]].mul(1000000000)).div(balances);
            if (proportion>0){
                 feesamount=(_amount.mul(1000000000000000000)).div(proportion);
                 if(feesamount>0){
                    stakersBalances[stakersAddress[i]] = stakersBalances[stakersAddress[i]].add(feesamount);
                 }
            }
        }
    }

    /// @notice add a staking amount to the contract
    /// @dev add a staking amount to the contract with token address and amount
    /// @param _amount uint256
    function addStaking(uint256 _amount) external{
        require(_amount>0, "This amount is not allowed");
        require(IERC20(tokenAddress).balanceOf(address(msg.sender))>=_amount, "Balance error");
        require(IERC20(tokenAddress).allowance(address(msg.sender),address(this))>=_amount, "Allowance error");


        bool successTransfer=IERC20(tokenAddress).transferFrom(msg.sender,address(this),_amount);

        if (successTransfer) {
            if(isStakers[msg.sender]==false){
                isStakers[msg.sender]=true;
                stakersAddress.push(msg.sender);
            }
            stakersBalances[msg.sender] =  (stakersBalances[msg.sender]).add(_amount);

            //Event
            emit Staking("Stake",msg.sender,_amount,block.timestamp);
        }
    }

    /// @notice withdraw a staking amount from the contract
    /// @dev withdraw staking amount to the contract with token address and amount
    /// @param _amount uint256
    function withdrawStaking(uint256 _amount) external nonReentrant {
        require(stakersBalances[msg.sender]>=_amount,"Not this staking balance");
        require(_amount>0,"This amount is not allowed");

        if (IERC20(tokenAddress).allowance(address(this),address(msg.sender))<_amount){
            IERC20(tokenAddress).approve(address(msg.sender),_amount);
        }

        bool successTransfer=IERC20(tokenAddress).transfer(msg.sender,_amount);
        if (successTransfer) {    
            stakersBalances[msg.sender] =  (stakersBalances[msg.sender]).sub(_amount);
            if(stakersBalances[msg.sender]==0){
                isStakers[msg.sender]=false;
            }

            //Event
            emit Staking("UnStake",msg.sender,_amount,block.timestamp);
        }
    }

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