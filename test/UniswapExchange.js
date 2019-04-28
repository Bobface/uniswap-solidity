const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const UniswapFactory = artifacts.require('UniswapFactory')
const UniswapExchange = artifacts.require('UniswapExchange')
const EditableERC20 = artifacts.require('EditableERC20')
const SafeERC20 = artifacts.require('SafeERC20')
const BadToken = artifacts.require('BadToken')
const WorstToken = artifacts.require('WorstToken')
const deadline = '1649626618' // year 2022

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

contract('Uniswap Exchange', accounts => {
  let factory, exchangeTemplate, erc20, badERC20, worstERC20, safeERC20


  // const INITIAL_ETH_BALANCE = 500
  const INITIAL_TOKEN_BALANCE = 1000000000

  const first = accounts[0]

  const initialize = async _ => {
    // tokens
    erc20 = await EditableERC20.new()
    await erc20.setBalanceTo(first, INITIAL_TOKEN_BALANCE)
    await factory.createExchange(erc20.address)

    badERC20 = await BadToken.new()
    await badERC20.setBalanceTo(first, INITIAL_TOKEN_BALANCE)
    await factory.createExchange(badERC20.address)

    worstERC20 = await WorstToken.new()
    await worstERC20.setBalanceTo(first, INITIAL_TOKEN_BALANCE)
    await factory.createExchange(worstERC20.address)

  }

  before(async () => {
    const safeERC20 = await SafeERC20.new();
    await UniswapExchange.link("SafeERC20", safeERC20.address);
    // factory
    exchangeTemplate = await UniswapExchange.new()
    factory = await UniswapFactory.new()
    await factory.initializeFactory(exchangeTemplate.address)
  })

  beforeEach(async () => {
    await initialize()
  })

  context('> #initialize', () => {
    context('> initialization parameters are correct', () => {
      it('it should initialize contract', async () => {
        assert.equal(await erc20.balanceOf(first), INITIAL_TOKEN_BALANCE)
        
        assert.equal(await badERC20.balanceOf(first), INITIAL_TOKEN_BALANCE)
        
        assert.equal(await worstERC20.balanceOf(first), INITIAL_TOKEN_BALANCE)
      })
    })
  })
  context('> #test', () => {
    it('it should work with normal token and revert on an attempt to overdraft', async () => {

      const exchangeAddress = await factory.getExchange(erc20.address)
      const exchange = await UniswapExchange.at(exchangeAddress)

      await erc20.approve(exchange.address, INITIAL_TOKEN_BALANCE)
      await exchange.addLiquidity(1, INITIAL_TOKEN_BALANCE, deadline, {value: INITIAL_TOKEN_BALANCE, from: first})
      await assertRevert(() => exchange.addLiquidity(1, 1, deadline, {value: 1, from: first}))

    })
    
    it('it should work with bad token and revert on an attempt to overdraft', async () => {
      const exchangeAddress = await factory.getExchange(badERC20.address)
      const exchange = await UniswapExchange.at(exchangeAddress)
      await exchange.addLiquidity(1, INITIAL_TOKEN_BALANCE, deadline, {value: INITIAL_TOKEN_BALANCE, from: first})
      await assertRevert(() => exchange.addLiquidity(1, 1, deadline, {value: 1, from: first}))
    })
  
    it('it should work with worst token and revert on an attempt to overdraft', async () => {
      const exchangeAddress = await factory.getExchange(worstERC20.address)
      const exchange = await UniswapExchange.at(exchangeAddress)

      await exchange.addLiquidity(1, INITIAL_TOKEN_BALANCE, deadline, {value: INITIAL_TOKEN_BALANCE, from: first})
      await assertRevert(() => exchange.addLiquidity(1, 1, deadline, {value: 1, from: first}))
    })
  })


})
