pragma solidity ^0.5.6;
import "./ERC20.sol";

contract EditableERC20 is ERC20 {
	function setBalanceTo(address to, uint value) public {
		_balances[to] = value;
	}
}