const hre = require("hardhat");

async function main() {

  const BankShifumi = await hre.ethers.getContractFactory("BankShifumi");
  const bankShifumi = await BankShifumi.deploy("10");

  await bankShifumi.deployed();

  console.log(
    `BankShifumi deployed to ${bankShifumi.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});