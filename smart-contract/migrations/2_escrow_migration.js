const Escrow = artifacts.require("Escrow");

module.exports = function (deployer) {
  deployer.deploy(
    Escrow, 
    '0x456227c12e986f9e55163c559d311957864735e5', 
    '0xe80e58299770d1e562eab61e16a771ed9281bf42'
  );
};
