const hre = require("hardhat");

async function main() {

  const contractName="BankShifumi"
  const gasToken="MATIC";
  const chainlinkID=1;
  const erc20Address="0xD729715C32811650074975B1c56b1d5fB7405402";
  const betlimitation=10;

  const BankShifumi = await hre.ethers.getContractFactory(contractName);
  const bankShifumi = await BankShifumi.deploy(gasToken,chainlinkID);
  await bankShifumi.deployed();

  console.log(`------------`);
  console.log(`BankShifumi deployed to ${bankShifumi.address}`);

  console.log(`------------`);
  console.log(`Allow Shifumi Token in contract`);
  const addressToken=erc20Address;
  await bankShifumi.setWhitelistToken(addressToken,true);
  const allowtoken = await bankShifumi.getWhitelistToken(addressToken);
  console.log(`Result: ${allowtoken}`);

  console.log(`------------`);
  console.log(`Set the bet limit to ${betlimitation}`);
  await bankShifumi.setBetLimit(betlimitation);
  const betlimit = await bankShifumi.getBetLimit();
  console.log(`Result: ${betlimit}`);
  console.log(`------------`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});