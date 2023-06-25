/*
  Try `truffle exec scripts/get_voting_status.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

const Voting = artifacts.require("Voting");
const owner = "0x8869242C5BB22a38b48C38786F8c74A975687C0d";
const voter1 = "0x3236A5A1974700f033e4367BA7361Bd8a5917657";
const voter2 = "0x2f1E7C34e6c564f4c545520F0ac406c59dB46D8b";

module.exports = async function (callback) {
  const deployed = await Voting.deployed();

  await deployed.addVoter(voter1, {from: owner});
  await deployed.addVoter(voter2, {from: owner});

  callback();
};