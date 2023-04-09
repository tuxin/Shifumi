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
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IDataInterfaceGame {
  function getMultiplicator(uint8[] memory _numbers) external pure returns(uint);
  function getRandomNumber() external pure returns(uint8);
  function getGameName() external pure returns(string memory);
  function getModulo() external pure returns(uint8);
  function getMaxRound() external pure returns(uint8);
  function getWinningRound() external pure returns(uint8);
}

contract BankShifumi is Ownable,Pausable,VRFConsumerBaseV2  {   
    
    uint8 public betLimit; 
    uint16 requestConfirmations = 2;
    uint32 callbackGasLimit = 1000000;  //Chainlink
    uint64 s_subscriptionId; //Chainlink Your subscription ID.

    string public gasToken;

    address[] arrayWhiteListToken;
    
    bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;//Chainlink
   
    struct TokenInformation {
        string name;
        uint balance; 
    }

    struct Bet { //Chainlink
        uint8 modulo;
        uint8 randomNumber;
        uint8 maxRound;
        uint8 winningRound;
        uint256 multiplier;
        uint256 amount;
        uint256 id;
        uint8[] numbers;
        uint256[] result;
        uint256[] randomWords;
        address gameAddress;
        address tokenAddress;
        address playerAddress;
        string tokenName;
    }

    struct Round {
        uint winningRound;
        uint totalRound;
    }

    mapping(address=> bool) public whitelistToken; 
    mapping(address=> bool) public whitelistGame; 
    mapping(uint256 => Bet) public betList; //Chainlink /* requestId --> requestStatus */
    mapping(address => mapping(address => Round)) public userGameRound;

    VRFCoordinatorV2Interface COORDINATOR; //For Chainlink

    using SafeMath for uint256;
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
    event BetThrow (uint _id,string _gameName,address _account,uint256 _amount,uint8[] _numbers,uint _multiplier,string _nameToken,uint _timestamp);
    event ResultBet(uint _id,string _gameName,address _account,uint256 _amount,uint8[] _numbers,uint _multiplier,string _nameToken,uint _timestamp,string _result,uint256 _randomnumber,uint256 _winningamount);

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

        bool successTransfer;
        string memory nameToken;
        uint8 modulo = IDataInterfaceGame(_gameContract).getModulo();
        uint8 maxRound = IDataInterfaceGame(_gameContract).getMaxRound();
        uint8 winningRound = IDataInterfaceGame(_gameContract).getWinningRound();
        uint8 randomNumber = IDataInterfaceGame(_gameContract).getRandomNumber() ;
        uint256 multiplicator=IDataInterfaceGame(_gameContract).getMultiplicator(_numbers) ;
        uint256 maxgain=multiplicator.mul(_amount);
        uint256 requestId;

        if(_token==address(0)){
            nameToken = gasToken;
            successTransfer=true;
        }else{
            nameToken = IERC20Metadata(_token).name();

            //Allow smartcontrat to send rewards
            if (IERC20(_token).allowance(address(this),address(msg.sender))<maxgain){
                IERC20(_token).approve(address(msg.sender),maxgain);
            }

            successTransfer=IERC20(_token).transferFrom(msg.sender,address(this),_amount);
        }
        
        if(successTransfer){
            requestId = COORDINATOR.requestRandomWords(
                keyHash,
                s_subscriptionId,
                requestConfirmations,
                callbackGasLimit,
                randomNumber
            );

            if(requestId>0){
                gameId.increment();

                betList[requestId] = Bet({
                    modulo:modulo,
                    randomNumber:randomNumber, 
                    randomWords: new uint256[](0),
                    result: new uint256[](randomNumber),
                    gameAddress:_gameContract,
                    tokenAddress:_token,
                    playerAddress:msg.sender,
                    numbers:_numbers,
                    multiplier:multiplicator,
                    amount:_amount,
                    id: gameId.current(),
                    maxRound:maxRound ,
                    winningRound:winningRound,
                    tokenName:nameToken
                });       

                emit BetThrow(gameId.current(),IDataInterfaceGame(_gameContract).getGameName(),msg.sender,_amount,_numbers,multiplicator,nameToken,block.timestamp);
            }
        }
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
        Bet memory betInProgress = betList[_requestId];
        bool result;
        bool sendAmount;
        uint256 randomNumber;
        uint256 playerNumber;
        uint256 winningAmount;  
        string memory resultName="LOSE";

        for (uint i = 0; i < _randomWords.length; i++) {
            randomNumber=(_randomWords[i] % betInProgress.modulo) + 1;
            for (uint j = 0; j < betInProgress.numbers.length; j++) { 
                playerNumber = betInProgress.numbers[j];
                if(playerNumber==randomNumber){
                    result=true;
                    resultName="WIN";
                    winningAmount=(betInProgress.amount.mul(betInProgress.multiplier)).div(10);
                    break;
                }
            }
             if(result==true){
                 break;
             }
        }

        userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].totalRound++;
        if(result==true){
            userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].winningRound++;

            if(userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].winningRound>=betInProgress.winningRound){
                //Player win
                userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].winningRound=0;
                userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].totalRound=0;

                sendAmount=true;
                
            }
        }else{     
            if(userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].totalRound>=betInProgress.maxRound){
                //Player lose
                userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].winningRound=0;
                userGameRound[betInProgress.gameAddress][betInProgress.playerAddress].totalRound=0;
            }
        }

        if(sendAmount==true){
            sendPayout(betInProgress.playerAddress,betInProgress.tokenAddress,winningAmount);
        }
        
        emit ResultBet(betInProgress.id,IDataInterfaceGame(betInProgress.gameAddress).getGameName(),betInProgress.playerAddress,betInProgress.amount,betInProgress.numbers,betInProgress.multiplier,betInProgress.tokenName,block.timestamp,resultName,randomNumber,winningAmount);
    }

    function sendPayout(address _player,address _token,uint256 winningAmount) internal{
        if(_token==address(0)){
                (bool sent, bytes memory data) = payable(_player).call{value: winningAmount}("");
            }else{
                IERC20(_token).transfer(_player,winningAmount);
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}