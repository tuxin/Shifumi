require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

const { MNEMONIC, INFURA_ID, ETHERSCAN_API_KEY} = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_ID}`,
      accounts: {
        mnemonic: `${MNEMONIC}`,
      },
      chainId: 5,
      blockConfirmations : 6
    },
  },
  etherscan:{
    apiKey:ETHERSCAN_API_KEY,
  },
  solidity: "0.8.19",
};