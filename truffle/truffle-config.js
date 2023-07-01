// const { MNEMONIC, PROJECT_ID } = process.env;
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

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
    goerli:{
      provider : function(){ 
        return new HDWalletProvider(
          `${process.env.MNEMONIC}`, 
          `https://goerli.infura.io/v3/${process.env.INFURA_ID}`
        )
      },
      network_id:5
    }
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
  