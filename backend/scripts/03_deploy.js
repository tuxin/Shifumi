const hre = require("hardhat");

async function main() {

  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const eRC20Token = await ERC20Token.deploy(10000000000000);

  await eRC20Token.deployed();

  console.log(
    `eRC20Token deployed to ${eRC20Token.address}`
  );

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});