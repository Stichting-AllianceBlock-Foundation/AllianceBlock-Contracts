// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

library PercentageCalculator {
    using SafeMath for uint256;

    /**
     * @dev Percentages will be provided in thousands to represent 3 digits after the decimal point.
     * the division is made by 100000.
     */
    function div(uint256 _amount, uint256 _percentage) public pure returns (uint256) {
        return _amount.mul(_percentage).div(100000);
    }
}
