pragma solidity ^0.5.6;

import "./UniswapExchange.sol";
import "../interfaces/IUniswapFactory.sol";
import "../interfaces/IUniswapExchange.sol";


contract UniswapFactory {

  /***********************************|
  |       Events And Variables        |
  |__________________________________*/

  event NewExchange(address indexed token, address indexed exchange);

  address public exchangeTemplate;
  uint256 public tokenCount;

  address public adx;
  UniswapExchange public adxExchange;
  uint public adxExchangeId;
  IUniswapFactory public realUniswapFactory;

  mapping (address => address) internal token_to_exchange;
  mapping (address => address) internal exchange_to_token;
  mapping (uint256 => address) internal id_to_token;

  /***********************************|
  |         Factory Functions         |
  |__________________________________*/

  function initializeFactory(address _template, address _adx, address _realUniswapFactory) public {
    require(exchangeTemplate == address(0), "exchange template must be zero address");
    require(_template != address(0), "template must not be zero address");
    require(_adx != address(0), "adx must not be zero address");
    require(_realUniswapFactory != address(0), "real uniswap factory must not be zero address");

    exchangeTemplate = _template;

    adx = _adx;
    realUniswapFactory = IUniswapFactory(_realUniswapFactory);

    UniswapExchange exchange = new UniswapExchange();
    exchange.setup(adx);

    adxExchange = exchange;
    adxExchangeId = 1;
    tokenCount = 1;

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

  function getTokenWithId(uint256 tokenId) public view returns (address) {
    if (tokenId == adxExchangeId) {
      return adx;
    }
    return realUniswapFactory.getTokenWithId(tokenId);
  }

}

