// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./token/AllianceBlockToken.sol";

contract BatchTransfer is Ownable {
    address public deployedTokenAddress;
    constructor(address tokenAddress) public {
        deployedTokenAddress = tokenAddress;
    }

     function sendTokens(address[] memory addresses, uint256[] memory balances) public onlyOwner {
            for(uint i = 0; i < addresses.length; i++) { 
                IERC20 token = IERC20(deployedTokenAddress);
                require(balances[i] <= token.balanceOf(address(this)), "Not enough balance");
                token.approve(address(this), token.balanceOf(address(this)));
                token.transferFrom(address(this), addresses[i], balances[i]);
            }
    }
} 