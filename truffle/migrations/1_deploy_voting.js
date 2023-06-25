const voting = artifacts.require("Voting");

module.exports = function (deployer) {
  deployer.deploy(voting);
};
