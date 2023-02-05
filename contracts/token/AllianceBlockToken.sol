// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";


error TokenTransferWhilePaused();
error TokenTransferToThisContract();
error SnapshotInvalidRole();

contract AllianceBlockToken is ERC20PresetMinterPauserUpgradeable, ERC20SnapshotUpgradeable {

    // "AllianceBlock Token", "ALBT"
     function init(
        string memory name,
        string memory symbol,
        address admin,
        address minter
    ) public initializer {
        __ERC20_init_unchained(name, symbol);
        __ERC20Snapshot_init_unchained();
        __Pausable_init_unchained();
        // We don't use __ERC20PresetMinterPauser_init_unchained to avoid giving permisions to _msgSender
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
        _setupRole(PAUSER_ROLE, admin);
        _setupRole(MINTER_ROLE, minter);
    }

    // Update balance and/or total supply snapshots before the values are modified. This is implemented
    // in the _beforeTokenTransfer hook, which is executed for _mint, _burn, and _transfer operations.
     function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20PresetMinterPauserUpgradeable, ERC20SnapshotUpgradeable) {
        ERC20SnapshotUpgradeable._beforeTokenTransfer(from, to, amount);
        if (paused()) {
            revert TokenTransferWhilePaused();
        }
    }


    // Avoid direct transfers to this contract
    function _transfer(address from, address to, uint256 amount) internal override {
        if (to == address(this)) {
            revert TokenTransferToThisContract();
        }
        super._transfer(from, to, amount);
    }

    /**
     * @dev Get the current snapshotId
     */
    function getCurrentSnapshotId() public view returns (uint256) {
        return _getCurrentSnapshotId();
    }

    /**
     * @dev Creates a new snapshot and returns its snapshot id.
     *
     * Emits a {Snapshot} event that contains the same id.
     *
     * {_snapshot} is `internal` and you have to decide how to expose it externally. Its usage may be restricted to a
     * set of accounts, for example using {AccessControl}, or it may be open to the public.
     */
    function snapshot() public returns (uint256) {
        if (!hasRole(DEFAULT_ADMIN_ROLE, _msgSender())) {
            revert SnapshotInvalidRole();
        }
        return _snapshot();
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public override {
        super.pause();
        _snapshot();
    }


}
