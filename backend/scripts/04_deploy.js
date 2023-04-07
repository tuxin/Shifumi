const hre = require("hardhat");

async function main() {

  //Constants
  const contractName="CoinFlip"
  const bankContract="0xF8e31cb472bc70500f08Cd84917E5A1912Ec8397";
  const multiplicator=18;
  const randomNumber=1;
  const gameName="CoinFlip";
  const contractBankName="BankShifumi"

  const CoinFlip = await hre.ethers.getContractFactory(contractName);
  const coinFlip = await CoinFlip.deploy(bankContract,multiplicator,randomNumber,gameName);

  await coinFlip.deployed();

  console.log(`------------`);
  console.log(`CoinFlip deployed to ${coinFlip.address}`);

  //We need to add this contract to the bank contract
  console.log(`------------`);
  console.log(`Allow CoinFlip contract in the bank contract`);
  const bankShifumi = await hre.ethers.getContractAt(contractBankName,bankContract);
  await bankShifumi.setWhitelistGame(coinFlip.address,true);
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