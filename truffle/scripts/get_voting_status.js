/*
  Try `truffle exec scripts/get_voting_status.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

const Voting = artifacts.require("Voting");

module.exports = async function (callback) {
  const deployed = await Voting.deployed();

  const currentStatus = await deployed.workflowStatus.call();
  console.log(`Current status : ${currentStatus}`);

  callback();
};