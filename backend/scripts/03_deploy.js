const hre = require("hardhat");

async function main() {

  const Crowdsale = await hre.ethers.getContractFactory("Crowdsale");
  const crowdsale = await Crowdsale.deploy(1000000000000);

  await crowdsale.deployed();

  console.log(
    `CoinFlip deployed to ${crowdsale.address}`
  );

  console.log(await crowdsale.token.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});