/**
 * Script to register voters for testing
 * Try `truffle exec scripts/register_voters.js`, you should `truffle migrate` first.
 */

const Voting = artifacts.require("Voting");

module.exports = async function (callback) {
  const deployed = await Voting.deployed();

  const accounts = await web3.eth.getAccounts();
  for (const i in accounts) {
    console.log(`account[${i}]: ${accounts[i]}`);  
  }

  callback();
};