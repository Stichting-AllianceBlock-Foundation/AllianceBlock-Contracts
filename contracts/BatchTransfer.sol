// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BatchTransfer {

     function sendTokens(address deployedTokenAddress, address[] memory addresses, uint256[] memory balances) public {
            require(addresses.length == balances.length, "The two arrays must be with the same length");
            IERC20 token = IERC20(deployedTokenAddress);
            for(uint i = 0; i < addresses.length; i++) {
                require(balances[i] <= token.balanceOf(msg.sender), "Not enough balance");
                bool result = token.transferFrom(msg.sender, addresses[i], balances[i]);
                require(result, "The transfer was not successful");
            }
    }
}
