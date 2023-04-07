const hre = require("hardhat");

async function main() {

  const contractName="StakingShifumi"
  const bankAddress="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const erc20Address="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

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