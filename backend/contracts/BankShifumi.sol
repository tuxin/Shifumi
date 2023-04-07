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
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";




interface IDataInterfaceGame {
  function getMultiplicator(uint8[] memory _numbers) external pure returns(uint);
  function getRandomNumber() external pure returns(uint);
  function getGameName() external pure returns(string memory);
}

contract BankShifumi is Ownable,Pausable,VRFConsumerBaseV2  {   
    
    uint8 public betLimit; 
    uint16 requestConfirmations = 3;
    uint32 callbackGasLimit = 100000;  //Chainlink
    uint256 public lastRequestId; //Chainlink

    string public gasToken;
    uint64 s_subscriptionId; //Chainlink Your subscription ID.

    address[] arrayWhiteListToken;
    uint256[] public requestIds; //Chainlink
    
    bytes32 keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;//Chainlink
    struct TokenInformation {
        string name;
        uint balance; 
    }

    struct RequestStatus { //Chainlink
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

    mapping(address=> bool) public whitelistToken; 
    mapping(address=> bool) public whitelistGame; 
    mapping(uint256 => RequestStatus) public s_requests; //Chainlink /* requestId --> requestStatus */

    VRFCoordinatorV2Interface COORDINATOR; //For Chainlink

    using Counters for Counters.Counter;
    Counters.Counter private gameId;

    constructor(string memory _gasToken,uint64 subscriptionId) VRFConsumerBaseV2(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed) {
        gasToken=_gasToken;
        whitelistToken[address(0)] = true;
        arrayWhiteListToken.push(address(0));
        COORDINATOR = VRFCoordinatorV2Interface(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed);
        s_subscriptionId = subscriptionId;
    }

    // ** EVENTS ** /
    event Bet(uint _id,string _gameName,address _account,uint256 _amount,uint8[] _numbers,uint _multiplier,string _nameToken,uint _timestamp);
    event Back(uint _id);

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
    function bet(address _gameContract,address _token,uint256 _amount,uint8[] memory _numbers) payable external whenNotPaused{
        require(getWhitelistToken(_token)==true, "This token is not allowed");
        require(getWhitelistGame(_gameContract)==true, "This address is not allowed");
        require(_amount>0,"This amount is not allowed");
        require(_numbers.length>0,"Empty numbers array");
        require(IDataInterfaceGame(_gameContract).getMultiplicator(_numbers)>0,"Multiplicator is not valid");
        require(IDataInterfaceGame(_gameContract).getRandomNumber()>0,"Multiplicator is not valid");

        string memory nameToken;
        uint256 multiplicator;
        uint requestId;

        multiplicator=IDataInterfaceGame(_gameContract).getMultiplicator(_numbers);
        gameId.increment();

        if(_token==address(0)){
            nameToken = gasToken;
          }else{
            nameToken = IERC20Metadata(_token).name();
          }

        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            1
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;

        emit Bet(requestId,IDataInterfaceGame(_gameContract).getGameName(),msg.sender,_amount,_numbers,multiplicator,nameToken,block.timestamp);
        //uint256 requestId = requestRandomWords();
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

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit Back(_requestId);
    }

    // to check the request status of random number call.
    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}