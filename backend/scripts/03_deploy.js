const hre = require("hardhat");

async function main() {

  const contractName="StakingShifumi"
  const bankAddress="0x3f642FfAc96546fB84D9Cb1B43cCe5F222b105C5";
  const erc20Address="0xD729715C32811650074975B1c56b1d5fB7405402";

  console.log(`------------`);
  const StakingShifumi = await hre.ethers.getContractFactory(contractName);
  const stakingShifumi = await StakingShifumi.deploy(bankAddress,erc20Address);
  await stakingShifumi.deployed();
  console.log(`stakingShifumi deployed to ${stakingShifumi.address}`);
  console.log(`------------`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});