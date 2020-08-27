//"SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";

library PercentageCalculator {
	using SafeMath for uint256;

	/*
	Note: Percentages will be multiplied by 1000 to be stored with 3 digit after the decimal point.
	The division is made by 10000 
	*/ 
	function div(uint256 _amount, uint256 _percentage) public view returns(uint256) {
		return _amount.mul(_percentage).div(10000);
	}
}