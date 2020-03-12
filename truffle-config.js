
const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

const infuraKey = process.env.INFURA_KEY;
const privateKey = process.env.PRIVATE_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  infuraKey,
  privateKey,
  etherscanKey,

  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    etherscan: etherscanKey
  },

  networks: {
    ganache: {
      network_id: "*",
      host: "127.0.0.1",
      port: 8545,
      gas: 0xfffffffffff
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8545,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://mainnet.infura.io/v3/${infuraKey}`
        ),
      network_id: 1,
      gasPrice: 1500000000
    },
  },
  compilers:  {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "byzantium",
      version: "0.5.7"
    }
  },

  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      gasPrice: 21,
      outputFile: "/dev/null",
      showTimeSpent: true
    }
  }

}
