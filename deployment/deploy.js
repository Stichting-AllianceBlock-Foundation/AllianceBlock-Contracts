const etherlime = require('etherlime-lib');
const AllianceBlockToken = require('../build/AllianceBlockToken.json');
const BatchTransfer = require('../build/BatchTransfer.json');
const Vesting = require('../build/Vesting.json');
const PercentageCalculator = require('../build/PercentageCalculator.json');

const deploy = async (network, secret, etherscanApiKey) => {
	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret,
		   network, '7797fd5aada5475c831fedefe288a949', {
			etherscanApiKey 
		   });
	const allianceBlockToken = await deployer.deploy(AllianceBlockToken, false);
	const address = '0xD033fAC764fDB548542fe4c6897562a9114BdBb7';
	const minterRole = await allianceBlockToken.MINTER_ROLE();
	const pauserRole = await allianceBlockToken.PAUSER_ROLE();
	const deployerAddress = deployer.signer.address;
	const minterRoleTransaction = await allianceBlockToken.grantRole(minterRole, address);
	await allianceBlockToken.verboseWaitForTransaction(minterRoleTransaction, 'Granting minter role');
	const pauserRoleTransaction = await allianceBlockToken.grantRole(pauserRole, address);
	await allianceBlockToken.verboseWaitForTransaction(pauserRoleTransaction, 'Granting pauser role');
	const result = await allianceBlockToken.hasRole(minterRole, address);
	console.log('Multi sig has a minter role: ', result);
	const result1 = await allianceBlockToken.hasRole(pauserRole, address);
	console.log('Multi sig has a pauser role: ', result1);
	const revokeMinterRoleTransaction = await allianceBlockToken.revokeRole(minterRole, deployerAddress);
	await allianceBlockToken.verboseWaitForTransaction(revokeMinterRoleTransaction, 'Revoking minter role');
	const revokePauserRoleTransaction = await allianceBlockToken.revokeRole(pauserRole, deployerAddress)
	await allianceBlockToken.verboseWaitForTransaction(revokePauserRoleTransaction, 'Revoking pauser role');
	await deployer.deploy(BatchTransfer);

	const percentageCalculator = await deployer.deploy(PercentageCalculator);
	const libraries = {
		PercentageCalculator: percentageCalculator.contractAddress
	}
	const cumulativeAmountsToVest = []
	let periodAmount = 1000
	for (let i = 0; i < 24; i++) {
		periodAmount += 1000
		cumulativeAmountsToVest.push(periodAmount)
		
	}
	await deployer.deploy(Vesting,libraries,allianceBlockToken.contractAddress,cumulativeAmountsToVest)
};

module.exports = {
	deploy
};