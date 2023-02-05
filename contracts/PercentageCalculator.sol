// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library PercentageCalculator {

	/*
	Note: Percentages will be provided in thousands to represent 3 digits after the decimal point.
	The division is made by 100000
	*/
	function div(uint256 _amount, uint256 _percentage) public pure returns(uint256) {
		return _amount * _percentage / 100000;
	}
}
