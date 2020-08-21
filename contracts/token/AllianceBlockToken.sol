// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract AllianceBlockToken is ERC20PresetMinterPauser {
     bytes32 public constant MINTERS_ROLE = keccak256("MINTER_ROLE");

     constructor() public ERC20PresetMinterPauser("AllianceBlock Token", "ALBT") {}

     function removeMinterRole(address owner) public {
          revokeRole(MINTER_ROLE, owner);
     }
}