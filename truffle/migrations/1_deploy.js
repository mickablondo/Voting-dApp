const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
  await deployer.deploy(Voting);
  const instance = await Voting.deployed();
  console.log('Voting contract deployed in : ', instance.address);
};