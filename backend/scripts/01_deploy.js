const hre = require("hardhat");

async function main() {

  //Constants
  const contractName="ERC20Token"
  const supply="7777777000000000000000000";

  console.log(`------------`);
  const ERC20Token = await hre.ethers.getContractFactory(contractName);
  const eRC20Token = await ERC20Token.deploy(hre.ethers.BigNumber.from(supply));
  await eRC20Token.deployed();
  console.log(`eRC20Token deployed to ${eRC20Token.address}`);
  console.log(`------------`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});