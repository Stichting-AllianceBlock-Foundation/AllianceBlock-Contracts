<h2 align="center">AllianceBlock Smart Contracts</h2>


### ALBT token contract
A standard ERC20 contract owned by a multisignature wallet

### Vesting Smart Contract
Vesting smart contract able to handle vesting schedules for 24 months. Recipients withdraw amounts are presented as percentages, and vesting periods are presented with acumulative amounts of ALBT tokens.

### Percentage Calculator
Library used for more precise calculation of percentages

### Batch Transfer Smart Contract
Contract handling  batch transfers of ALBT tokens.


## Usage
```bash
npm install 
npm install -g etherlime

# Compile
etherlime compile

# Deploy 
etherlime deploy --network=<predefined-network> --secret=<your-private-key>

```
