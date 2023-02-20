// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';

contract ERC20Minter is ERC20PresetMinterPauser {
    constructor() ERC20PresetMinterPauser('AllianceBlock Token', 'ALBT') {}

    function removeMinterRole(address owner) public {
        revokeRole(MINTER_ROLE, owner);
    }
}
