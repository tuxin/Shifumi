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
import "@openzeppelin/contracts/utils/Counters.sol";


interface IDataInterfaceGame {
  function getMultiplicator(uint8[] memory _numbers) external pure returns(uint);
  function getRandomNumber() external pure returns(uint);
  function getGameName() external pure returns(string memory);
}

contract BankShifumi is Ownable,Pausable  {   
    
    uint8 public betLimit; 

    string public gasToken;

    address[] arrayWhiteListToken;

    struct TokenInformation {
        string name;
        uint balance; 
    }

    mapping(address=> bool) public whitelistToken; 
    mapping(address=> bool) public whitelistGame; 

    Counters.Counter private gameId;

    constructor(string memory _gasToken,uint8 _betlimit) {
        gasToken=_gasToken;
        betLimit=_betlimit;
        whitelistToken[address(0)] = true;
        arrayWhiteListToken.push(address(0));
    }

    // ** EVENTS ** /
    event Bet(uint _id,string _gameName,address _account,uint256 _amount,uint8[] _numbers);

    // ** GETTER ** //
    /// @notice Return the limit bet percentage. If its 10, you only can bet bank/10
    /// @dev Returns a setting uint.
    /// @return betLimit in uint8
    function getBetLimit() public view returns(uint8){
        return betLimit; 
    }

    /// @notice Return if an token is whitlist
    /// @dev Returns a boolean.
    /// @param _tokenAddress in address
    /// @return boolean
    function getWhitelistToken(address _tokenAddress) public view returns(bool){
        return whitelistToken[_tokenAddress]; 
    }

    /// @notice Return if the contract is whitlist
    /// @dev Returns a boolean.
    /// @param _gameAddress in address
    /// @return boolean
    function getWhitelistGame(address _gameAddress) public view returns(bool){
        return whitelistGame[_gameAddress]; 
    }

    // ** SETTER ** //
    /// @notice Set the limit bet percentage
    /// @dev Set the limit bet in uint8 percentage. Only between 1 and 99
    /// @param _betLimit in uint8 between 1 and 99
    function setBetLimit(uint8 _betLimit) external onlyOwner{
        require(_betLimit>0 && _betLimit<100, "This limit is not allowed");
        betLimit = _betLimit ; 
    }

    /// @notice Allow or not a token to be use
    /// @dev Set if we allow or not a token in the betting app
    /// @param _tokenAddress address of token
    function setWhitelistToken(address _tokenAddress,bool _whitelist) external onlyOwner{
        require(_tokenAddress!=address(0), "This address is not allowed");
        whitelistToken[_tokenAddress] = _whitelist;

        if(_whitelist){
            arrayWhiteListToken.push(_tokenAddress);
        }else{
            for (uint256 i = 0; i < arrayWhiteListToken.length; i++) {
                if (arrayWhiteListToken[i] == _tokenAddress) {
                    arrayWhiteListToken[i] = arrayWhiteListToken[arrayWhiteListToken.length - 1];
                    arrayWhiteListToken.pop();
                }
            }
        }
    }

    /// @notice Allow or not a game contract address to be use
    /// @dev Set if we allow or not a game contract address in the betting app
    /// @param _gameAddress address of token
    function setWhitelistGame(address _gameAddress,bool _whitelist) external onlyOwner{
        require(_gameAddress!=address(0), "This address is not allowed");
        whitelistGame[_gameAddress] = _whitelist;
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

    /// @notice Launch the game
    /// @dev Pause or unpause the contract with the openzeppeling contract
    /// @param _token token address,_amount bet amount,_numbers array of numbers
    function bet(address _gameContract,address _token,uint256 _amount,uint8[] memory _numbers) payable external{
        require(getWhitelistToken(_token)==true, "This token is not allowed");
        require(getWhitelistGame(_gameContract)==true, "This address is not allowed");
        require(_amount>0,"This amount is not allowed");
        require(_numbers.length>0,"Empty numbers array");
        require(IDataInterfaceGame(_gameContract).getMultiplicator(_numbers)>0,"Multiplicator is not valid");
        require(IDataInterfaceGame(_gameContract).getRandomNumber()>0,"Multiplicator is not valid");

        
        emit Bet(0,"TODO",msg.sender,_amount,_numbers);
    }

    /// @notice Return the all whitelist token
    /// @dev return an array of allow token
    /// returns address of token
    function getAllowToken() external view returns (address[] memory){
        return arrayWhiteListToken;
    }

    /// @notice Return all balance for an address
    /// @dev return struct TokenInformation
    /// returns TokenInformation
    function getBalanceAllowTokens(address _address) public view returns (string[] memory, uint[] memory){
        string[] memory names = new string[](arrayWhiteListToken.length);
        uint[]   memory balances = new uint[](arrayWhiteListToken.length);
        
        for (uint i = 0; i < arrayWhiteListToken.length; i++) {  
          if(arrayWhiteListToken[i]==address(0)){
            names[i] = gasToken;
            balances[i] = _address.balance;
            
          }else{
            names[i] = IERC20Metadata(arrayWhiteListToken[i]).name();
            balances[i] = IERC20(arrayWhiteListToken[i]).balanceOf(address(_address));
          }
        }

        return (names, balances);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}