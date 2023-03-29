const hre = require("hardhat");

async function main() {

  const Crowdsale = await hre.ethers.getContractFactory("Crowdsale");
  const crowdsale = await Crowdsale.deploy("777777777777777777");

  await crowdsale.deployed();

  console.log(
    `crowdsale deployed to ${crowdsale.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});