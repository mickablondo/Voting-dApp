// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;

// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    }
  },

  mocha: {

  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.20"
    }
  }
};
  