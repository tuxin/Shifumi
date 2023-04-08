const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Deployed BankShifumi", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBankShifumi() {
    const betLimit = 7;
    const supply = "7777777000000000000000000"
    const gameNameCoinFlip="CoinFlip"
    const coinFlipMultiplicator = 18
    const coinFlipRandomNumber = 1
    const coinFlipMaxRound = 1
    const coinFlipWinningRound = 1
    const CoinFlipModulo=2;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("ERC20Token");
    const eRC20 = await ERC20.deploy(supply);
    
    const BankShifumi = await ethers.getContractFactory("BankShifumi");
    const bankShifumi = await BankShifumi.deploy("ETH",1);
    await bankShifumi.setBetLimit(betLimit);

    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    const coinFlip = await CoinFlip.deploy(bankShifumi.address,coinFlipMultiplicator,coinFlipRandomNumber,coinFlipMaxRound,coinFlipWinningRound,"CoinFlip");

    const StakingShifumi = await ethers.getContractFactory("StakingShifumi");
    const stakingShifumi = await StakingShifumi.deploy(bankShifumi.address,eRC20.address);

    return { bankShifumi,coinFlip,betLimit,owner,otherAccount,eRC20,supply,gameNameCoinFlip,stakingShifumi,coinFlipMultiplicator,coinFlipRandomNumber,coinFlipMaxRound,coinFlipWinningRound,CoinFlipModulo };
  }

  //Testing the correct deployment
  describe("Deployment", function () {
    it("ERC20: Should set the right supply", async function () {
      const { eRC20,owner,supply } = await loadFixture(deployBankShifumi);
      expect(await eRC20.balanceOf(owner.address)).to.equal(supply);
    });
    
    it("BankShifumi: Should set the right betLimit", async function () {
      const { bankShifumi,betLimit } = await loadFixture(deployBankShifumi);
      expect(await bankShifumi.getBetLimit()).to.equal(betLimit);
    });

    it("BankShifumi: Should set the right owner", async function () {
      const { bankShifumi,owner } = await loadFixture(deployBankShifumi);
      expect(await bankShifumi.owner()).to.equal(owner.address);
    });

    it('BankShifumi: Should set the 0 address', async () => {
      const { bankShifumi } = await loadFixture(deployBankShifumi);
      expect(await bankShifumi.getWhitelistToken(ethers.constants.AddressZero)).to.equal(true);
    });

    it('BankShifumi: Should not in pause', async () => {
      const { bankShifumi } = await loadFixture(deployBankShifumi);
      expect(await bankShifumi.paused()).to.equal(false);
    });

    it("CoinFlip: Should set the right owner", async function () {
      const { coinFlip,owner } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.owner()).to.equal(owner.address);
    });

    it('CoinFlip: Should not in pause', async () => {
      const { coinFlip } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.paused()).to.equal(false);
    });
    
    it('CoinFlip: Should the correct game name', async () => {
      const { coinFlip,gameNameCoinFlip } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getGameName()).to.equal(gameNameCoinFlip);
    });

    it('CoinFlip: Should the correct module', async () => {
      const { coinFlip,CoinFlipModulo } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getModulo()).to.equal(CoinFlipModulo);
    });

    it('CoinFlip: Should the correct random number', async () => {
      const { coinFlip,coinFlipRandomNumber } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getRandomNumber()).to.equal(coinFlipRandomNumber);
    });

    it('CoinFlip: Should the correct max round', async () => {
      const { coinFlip,coinFlipMaxRound } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getMaxRound()).to.equal(coinFlipMaxRound);
    });

    it('CoinFlip: Should the correct winning round', async () => {
      const { coinFlip,coinFlipWinningRound } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getWinningRound()).to.equal(coinFlipWinningRound);
    });

    it('StakingShifumi: Should not in pause', async () => {
      const { stakingShifumi } = await loadFixture(deployBankShifumi);
      expect(await stakingShifumi.paused()).to.equal(false);
    });
    
    it('StakingShifumi: Should not in pause', async () => {
      const { stakingShifumi } = await loadFixture(deployBankShifumi);
      expect(await stakingShifumi.paused()).to.equal(false);
    });

    it('StakingShifumi: Should balances = 0', async () => {
      const { stakingShifumi } = await loadFixture(deployBankShifumi);
      expect(await stakingShifumi.getBalances()).to.equal(0);
    });

    it('StakingShifumi: Should fees claimable = 0', async () => {
      const { stakingShifumi } = await loadFixture(deployBankShifumi);
      expect(await stakingShifumi.getFeesclaimable()).to.equal(0);
    });

    it('StakingShifumi: Should the correct bank address', async () => {
      const { stakingShifumi,bankShifumi } = await loadFixture(deployBankShifumi);
      expect(await stakingShifumi.getBankAddress()).to.equal(bankShifumi.address);
    });
  });

  describe("Only Owner", function () {
    it('BankShifumi: Should not in pause by other account', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(bankShifumi.connect(otherAccount).pause()).to.be.revertedWith("Ownable: caller is not the owner");
    });
    
    it('BankShifumi: Should not whitelist token by other account', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(bankShifumi.connect(otherAccount).setWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3",true)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it('BankShifumi: Should not whitelist contract address by other account', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(bankShifumi.connect(otherAccount).setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it('BankShifumi: Should not whitelist token by other account', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(bankShifumi.connect(otherAccount).setBetLimit(12)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it('CoinFlip: Should not in pause by other account', async () => {
      const { coinFlip,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(coinFlip.connect(otherAccount).pause()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it('CoinFlip: Should not change multiplicator by other account', async () => {
      const { coinFlip,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(coinFlip.connect(otherAccount).setMultiplicator(2)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it('CoinFlip: Should not change how many random number by other account', async () => {
      const { coinFlip,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(coinFlip.connect(otherAccount).setRandomNumber(2)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it('CoinFlip: Should not change how many max round by other account', async () => {
      const { coinFlip,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(coinFlip.connect(otherAccount).setMaxRound(2)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it('CoinFlip: Should not change how many winning round by other account', async () => {
      const { coinFlip,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(coinFlip.connect(otherAccount).setWinningRound(2)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Change value", function () {
    it('BankShifumi: Should get and set the betLimit', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      const newLimit = 12;
      await bankShifumi.setBetLimit(newLimit);
      expect(await bankShifumi.getBetLimit()).to.equal(newLimit);
    });

    it('BankShifumi: Should get and set the WhiteListToken White', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3",true);
      expect(await bankShifumi.getWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3")).to.equal(true);
    });

    it('BankShifumi: Should get and set the WhiteListToken Black', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3",true);
      await bankShifumi.setWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3",false);
      expect(await bankShifumi.getWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3")).to.equal(false);
    });

    it('BankShifumi: Should get and set the WhiteListGame White', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true);
      expect(await bankShifumi.getWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3")).to.equal(true);
    });

    it('BankShifumi: Should get and set the WhiteListGame Black', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",false);
      expect(await bankShifumi.getWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3")).to.equal(false);
    });

    it('BankShifumi: Should get and set pause', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.pause();
      expect(await bankShifumi.paused()).to.equal(true);
    });

    it('BankShifumi: Should get and set unpause', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.pause();
      await bankShifumi.pause();
      expect(await bankShifumi.paused()).to.equal(false);
    });

    it('CoinFlip: Should get and set the random number', async () => {
      const { coinFlip } = await loadFixture(deployBankShifumi);
      await coinFlip.setRandomNumber(2);
      expect(await coinFlip.getRandomNumber()).to.equal(2);
    });

    it('CoinFlip: Should get and set the multiplicator number', async () => {
      const { coinFlip } = await loadFixture(deployBankShifumi);
      await coinFlip.setMultiplicator(2);
      expect(await coinFlip.getMultiplicator([1])).to.equal(2);
    });

    it('CoinFlip: Should get and set the max round number', async () => {
      const { coinFlip } = await loadFixture(deployBankShifumi);
      await coinFlip.setMaxRound(2);
      expect(await coinFlip.getMaxRound()).to.equal(2);
    });

    it('CoinFlip: Should get and set the winning round number', async () => {
      const { coinFlip } = await loadFixture(deployBankShifumi);
      await coinFlip.setWinningRound(2);
      expect(await coinFlip.getWinningRound()).to.equal(2);
    });

    it('CoinFlip: Should get and set unpause', async () => {
      const { coinFlip,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await coinFlip.pause();
      await coinFlip.pause();
      expect(await coinFlip.paused()).to.equal(false);
    });

    it('StakingShifumi: Should the correct bank address', async () => {
      const { stakingShifumi } = await loadFixture(deployBankShifumi);
      await stakingShifumi.setBankAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3")
      expect(await stakingShifumi.getBankAddress()).to.equal("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    });

    it('StakingShifumi: Should get and set pause', async () => {
      const { stakingShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await stakingShifumi.pause();
      expect(await stakingShifumi.paused()).to.equal(true);
    });

    it('StakingShifumi: Should get and set unpause', async () => {
      const { stakingShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await stakingShifumi.pause();
      await stakingShifumi.pause();
      expect(await stakingShifumi.paused()).to.equal(false);
    });
  });

  describe("Require setBetLimit", function () {
    it('BankShifumi: Should setBetLimit', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      const newLimit = 50;
      await bankShifumi.setBetLimit(newLimit);
      expect(await bankShifumi.getBetLimit()).to.equal(newLimit);
    });

    it('BankShifumi: Should setBetLimit not lower to 1', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      const newLimitLower = 0;
      await expect(bankShifumi.setBetLimit(newLimitLower)).to.be.revertedWith("This limit is not allowed");
    });

    it('BankShifumi: Should setBetLimit not higher to 99', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      const newLimitHigher = 100;
      await expect(bankShifumi.setBetLimit(newLimitHigher)).to.be.revertedWith("This limit is not allowed");
    });
  });

  describe("Require setWhitelistToken", function () {
    it('BankShifumi: Should setWhitelistToken ', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3",true);
      expect(await bankShifumi.getWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3")).to.equal(true);
    });

    it('BankShifumi: Should setWhitelistToken not address 0', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(bankShifumi.setWhitelistToken(ethers.constants.AddressZero,true)).to.be.revertedWith("This address is not allowed");
    });
  });

  describe("Require setWhitelistGame", function () {
    it('BankShifumi: Should setWhitelistGame ', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true);
      expect(await bankShifumi.getWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3")).to.equal(true);
    });

    it('BankShifumi: Should setWhitelistGame not address 0', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(bankShifumi.setWhitelistGame(ethers.constants.AddressZero,true)).to.be.revertedWith("This address is not allowed");
    });
  });

  describe("Require bet", function () {
    it('BankShifumi: Should contract game address is allow', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await expect(bankShifumi.bet("0x5fbdb2315678afecb367f032d93f642f64180aa3",ethers.constants.AddressZero,10000,[29,2])).to.be.revertedWith("This address is not allowed");
    });

    it('BankShifumi: Should token is allow', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true); //Allow game contract
      await expect(bankShifumi.bet("0x5fbdb2315678afecb367f032d93f642f64180aa3","0x5fbdb2315678afecb367f032d93f642f64180aa3",10000,[29,2])).to.be.revertedWith("This token is not allowed");
    });

    it('BankShifumi: Should amount is allow', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true); //Allow game contract
      await expect(bankShifumi.bet("0x5fbdb2315678afecb367f032d93f642f64180aa3",ethers.constants.AddressZero,0,[29,2])).to.be.revertedWith("This amount is not allowed");
    });

    it('BankShifumi: Should array is allow', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true); //Allow game contract
      await expect(bankShifumi.bet("0x5fbdb2315678afecb367f032d93f642f64180aa3",ethers.constants.AddressZero,100,[])).to.be.revertedWith("Empty numbers array");
    });
    
  });

  describe("Require setBankAddress", function () {
    it('StakingShifumi: Should setBankAddress ', async () => {
      const { stakingShifumi } = await loadFixture(deployBankShifumi);
      await stakingShifumi.setBankAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3");
      expect(await stakingShifumi.getBankAddress()).to.equal("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    });
  });

  describe("Require addFees", function () {
    it('StakingShifumi: Should addFees only bank address ', async () => {
      const { stakingShifumi,bankShifumi } = await loadFixture(deployBankShifumi);
      await expect(stakingShifumi.addFees(1)).to.be.revertedWith("Only bankaddress");
    });
  });

  describe("Require addStaking", function () {
    it('StakingShifumi: Should addStaking amount ', async () => {
      const { stakingShifumi,bankShifumi } = await loadFixture(deployBankShifumi);
      await expect(stakingShifumi.addStaking(0)).to.be.revertedWith("This amount is not allowed");
    });

    it('StakingShifumi: Should addStaking amount ', async () => {
      const { stakingShifumi,bankShifumi } = await loadFixture(deployBankShifumi);
      await stakingShifumi.addStaking(1);
    });
  });

  describe("Require getMultiplicator", function () {
    it('CoinFlip: getMultiplicator with 0 numbers', async () => {
      const { coinFlip } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getMultiplicator([])).to.equal(0);
    });

    it('CoinFlip: getMultiplicator with 1 number', async () => {
      const { coinFlip,coinFlipMultiplicator } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getMultiplicator([1])).to.equal(coinFlipMultiplicator);
    });

    it('CoinFlip: getMultiplicator with >1 number', async () => {
      const { coinFlip } = await loadFixture(deployBankShifumi);
      expect(await coinFlip.getMultiplicator([1,2])).to.equal(1);
    });
  });

 

  //describe("BankShifumi: Bet event", function () {
    //it('BankShifumi: Should array is allow', async () => {
      //const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      //await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true); //Allow game contract
      //await bankShifumi.bet("0x5fbdb2315678afecb367f032d93f642f64180aa3",ethers.constants.AddressZero,100,[1]);
     
    //});
  //});

});
