# AllianceBlock Smart Contracts

## NXRA token contract
An upgradable ERC20 contract owned by a multi-signature wallet. Also, it allows creating snapshots, pausing it, support (EIP-2612)[https://eips.ethereum.org/EIPS/eip-2612] and batch minting.

## Env variables
You will need to generate a .env file using .env.example as a boilerplate. PrivateKey or Mnemonic is necessary for live deployment but can be skipped for local development. SALT is needed for deterministic deployment, if none is provided it will use the default form constants.

## Usage
Need node 18 installed and yarn.
First, install the dependencies
```bash
yarn install
```

Then compile the contracts to get types from typechain
```bash
yarn compile
```

To run tests use
```bash
yarn test
```
It will also show gas used

To check converage run
```bash
yarn coverage
```

## Deploy
To deploy use
```bash
yarn deploy <NetworkName>
```
Where NetworkName is one of the networks configured in (hardhat.networks.ts)[./hardhat.networks.ts]
Deployment is deterministic, this means that it can be precalculated and that it will have the same address across all chains.
**Important to keep the same address, SALT and BYTECODE must be the same, bytecode includes not just the compiled contracts, but the parameters used in the constructor as well**

## Verification
The deployment script also verifies the smart contracts using `hardhat-etherscan`, but it needs the API KEY from the explorers, you will need to add them in the .env file.

If the network where you are deploying uses Blockscout, use Sourcify instead.
```bash
yarn hardhat --network <NetworkName> sourcify
```


