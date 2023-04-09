const hre = require("hardhat");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

  //Constants
  const contractName="CoinFlip"
  const bankContract="0xB2a30E74232b77d37d88114b670d96B665126254";
  const multiplicator=18;
  const randomNumber=1;
  const maxRound=1;
  const winningRound=1;
  const gameName="CoinFlip";
  const contractBankName="BankShifumi"

  const CoinFlip = await hre.ethers.getContractFactory(contractName);
  const coinFlip = await CoinFlip.deploy(bankContract,multiplicator,randomNumber,maxRound,winningRound,gameName);

  await coinFlip.deployed();

  console.log(`------------`);
  console.log(`CoinFlip deployed to ${coinFlip.address}`);

  //We need to add this contract to the bank contract
  console.log(`------------`);
  console.log(`Allow CoinFlip contract in the bank contract`);
  const bankShifumi = await hre.ethers.getContractAt(contractBankName,bankContract);
  await bankShifumi.setWhitelistGame(coinFlip.address,true);
  await sleep(10000);
  const allowgame = await bankShifumi.getWhitelistGame(coinFlip.address);
  console.log(`Result: ${allowgame}`);
  console.log(`------------`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});