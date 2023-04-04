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

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BankShifumi = await ethers.getContractFactory("BankShifumi");
    const bankShifumi = await BankShifumi.deploy("ETH",betLimit);

    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    const coinFlip = await CoinFlip.deploy(bankShifumi.address,18,1,"CoinFlip");

    //console.log(await bankShifumi.test(coinFlip.address,[1]));

    return { bankShifumi,coinFlip,betLimit,owner,otherAccount };
  }

  //Testing the correct deployment
  describe("Deployment", function () {
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
      await expect(bankShifumi.setBetLimit(newLimitLower)).to.be.revertedWith("This number is not allowed");
    });

    it('BankShifumi: Should setBetLimit not higher to 99', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      const newLimitHigher = 100;
      await expect(bankShifumi.setBetLimit(newLimitHigher)).to.be.revertedWith("This number is not allowed");
    });
  });

  describe("Require setMultiplicator", function () {
    it('BankShifumi: Should setMultiplicator', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      const newLimit = 50;
      await bankShifumi.setMultiplicator(newLimit);
      expect(await bankShifumi.getMultiplicator()).to.equal(newLimit);
    });

    it('BankShifumi: Should setMultiplicator not lower to 1', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      const newLimitLower = 0;
      await expect(bankShifumi.setMultiplicator(newLimitLower)).to.be.revertedWith("This number is not allowed");
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
      await expect(bankShifumi.bet("0x5fbdb2315678afecb367f032d93f642f64180aa3",ethers.constants.AddressZero,10000,[29,2])).to.be.revertedWith("This token is not allowed");
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

  describe("BankShifumi: Bet event", function () {
    it('BankShifumi: Should array is allow', async () => {
      const { bankShifumi,owner,otherAccount } = await loadFixture(deployBankShifumi);
      await bankShifumi.setWhitelistGame("0x5FbDB2315678afecb367f032d93F642f64180aa3",true); //Allow game contract
      await bankShifumi.bet("0x5fbdb2315678afecb367f032d93f642f64180aa3",ethers.constants.AddressZero,100,[1]);
     
    });
  });

});
