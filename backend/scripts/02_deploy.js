const hre = require("hardhat");

async function main() {

  const CoinFlip = await hre.ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

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