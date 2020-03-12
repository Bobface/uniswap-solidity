pragma solidity ^0.5.6;

import "./UniswapExchange.sol";
import "../interfaces/IUniswapFactory.sol";
import "../interfaces/IUniswapExchange.sol";


contract UniswapFactory {

  /***********************************|
  |       Events And Variables        |
  |__________________________________*/

  event NewExchange(address indexed token, address indexed exchange);

  address public adx;
  UniswapExchange public adxExchange;
  IUniswapFactory public realUniswapFactory;

  /***********************************|
  |         Factory Functions         |
  |__________________________________*/

  constructor(address _adx, address _realUniswapFactory) public {
    require(_adx != address(0), "adx must not be zero address");
    require(_realUniswapFactory != address(0), "real uniswap factory must not be zero address");

    adx = _adx;
    realUniswapFactory = IUniswapFactory(_realUniswapFactory);

    UniswapExchange exchange = new UniswapExchange();
    exchange.setup(adx);
    adxExchange = exchange;

    emit NewExchange(adx, address(exchange));
  }

  /***********************************|
  |         Getter Functions          |
  |__________________________________*/


  // All getters redirect to real Uniswap for all tokens exept ADX.

  function getExchange(address token) public view returns (address) {
    if (token == adx) {
      return address(adxExchange);
    }
    return realUniswapFactory.getExchange(token);
  }

  function getToken(address exchange) public view returns (address) {
    if (exchange == address(adxExchange)) {
      return adx;
    }
    return realUniswapFactory.getToken(exchange);
  }
}

