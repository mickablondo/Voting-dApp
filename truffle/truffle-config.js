// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  contracts_build_directory: "../client/src/contracts",
  networks: {

    // reserved by the standalone test command
    // development: { },

    // used for local development
    local: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
     },

  },

  mocha: {

  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    },
  },

};
  