# Uniswap Fork for AdEX with automatic Etherscan verification
Implements a Uniswap fork to be able to trade ADX for tokens listed on Uniswap.

## Usage:


1. Run `yarn` to install dependencies
2. Create a `.env` file in the directory root. The `.env` file specifies three parameters like this:
```
INFURA_KEY=...
PRIVATE_KEY=0x...
ETHERSCAN_KEY=...
```
The private key will be used for deployment on Mainnet. 

3. Run `truffle migrate --reset --network mainnet` to deploy to Mainnet.
4. Run `truffle run verify UniswapFactory --network mainnet` to verify the contract on Etherscan.
