const hre = require("hardhat");

async function main() {

  const BankShifumi = await hre.ethers.getContractFactory("BankShifumi");
  const bankShifumi = await BankShifumi.deploy("ETH","10");

  await bankShifumi.deployed();

  console.log(
    `BankShifumi deployed to ${bankShifumi.address}`
  );

  await bankShifumi.setWhitelistToken("0x5FbDB2315678afecb367f032d93F642f64180aa3",true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});