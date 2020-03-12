const UniswapFactory = artifacts.require("UniswapFactory");

module.exports = async function(deployer, network, accounts) {

    console.log(network);

    let adxMainnet = "";
    let uniswapMainnet = "";
    
    await deployer.deploy(UniswapFactory, adxMainnet, uniswapMainnet);
};
