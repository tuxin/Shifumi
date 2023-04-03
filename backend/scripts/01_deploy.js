const hre = require("hardhat");

async function main() {

  const BankShifumi = await hre.ethers.getContractFactory("BankShifumi");
  const bankShifumi = await BankShifumi.deploy("ETH","10");

  await bankShifumi.deployed();

  console.log(
    `BankShifumi deployed to ${bankShifumi.address}`
  );

  await bankShifumi.setWhitelistToken("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});