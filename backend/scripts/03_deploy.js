const hre = require("hardhat");

async function main() {

  const contractName="StakingShifumi"
  const bankAddress="0x9fd07Aae8D48e77408764518adfc7fC15Db27EB3";
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