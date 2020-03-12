const UniswapFactory = artifacts.require("UniswapFactory");

module.exports = async function(deployer, network, accounts) {

    console.log(network);

    let adxMainnet = "0x4470BB87d77b963A013DB939BE332f927f2b992e";
    let uniswapMainnet = "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95";
    
    await deployer.deploy(UniswapFactory, adxMainnet, uniswapMainnet);
};
