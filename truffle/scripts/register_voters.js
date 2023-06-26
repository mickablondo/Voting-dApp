/**
 * Script to register voters for testing
 * Try `truffle exec scripts/register_voters.js`, you should `truffle migrate` first.
 */

const Voting = artifacts.require("Voting");

module.exports = async function (callback) {
  const deployed = await Voting.deployed();

  const _owner = await deployed.owner();
  const _voter1 = (await web3.eth.getAccounts())[1];
  const _voter2 = (await web3.eth.getAccounts())[2];

  await deployed.addVoter(_voter1, {from: _owner});
  console.log('Added voter : ', _voter1);

  await deployed.addVoter(_voter2, {from: _owner});
  console.log('Added voter : ', _voter2);

  callback();
};