const hre = require("hardhat");

async function main() {

  const CoinFlip = await hre.ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy("0xAFF5e4456719DB7cf31e21254D9A49aaf5E48Ed8");

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