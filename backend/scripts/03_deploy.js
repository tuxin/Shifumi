const hre = require("hardhat");

async function main() {

  const CoinFlip = await hre.ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",18,1,"CoinFlip");

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