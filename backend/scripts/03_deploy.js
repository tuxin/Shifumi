const hre = require("hardhat");

async function main() {

  const CoinFlip = await hre.ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy("0x851356ae760d987E095750cCeb3bC6014560891C",18,1,"CoinFlip");

  await coinFlip.deployed();

  console.log(
    `CoinFlip deployed to ${coinFlip.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});