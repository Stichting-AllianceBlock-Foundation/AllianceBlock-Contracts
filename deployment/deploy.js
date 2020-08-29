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
	const defaultAdminRole = await allianceBlockToken.DEFAULT_ADMIN_ROLE();
	const deployerAddress = deployer.signer.address;
	const minterRoleTransaction = await allianceBlockToken.grantRole(minterRole, address);
	await allianceBlockToken.verboseWaitForTransaction(minterRoleTransaction, 'Granting minter role');
	const pauserRoleTransaction = await allianceBlockToken.grantRole(pauserRole, address);
	await allianceBlockToken.verboseWaitForTransaction(pauserRoleTransaction, 'Granting pauser role');
	const defaultAdminRoleTransaction = await allianceBlockToken.grantRole(defaultAdminRole, address);
	await allianceBlockToken.verboseWaitForTransaction(defaultAdminRoleTransaction, 'Granting admin role');
	const result = await allianceBlockToken.hasRole(minterRole, address);
	console.log('Multi sig has a minter role: ', result);
	const result1 = await allianceBlockToken.hasRole(pauserRole, address);
	console.log('Multi sig has a pauser role: ', result1);
	const result2 = await allianceBlockToken.hasRole(defaultAdminRole, address);
	console.log('Multi sig has an admin role: ', result2);
	const revokeMinterRoleTransaction = await allianceBlockToken.revokeRole(minterRole, deployerAddress);
	await allianceBlockToken.verboseWaitForTransaction(revokeMinterRoleTransaction, 'Revoking minter role');
	const revokePauserRoleTransaction = await allianceBlockToken.revokeRole(pauserRole, deployerAddress)
	await allianceBlockToken.verboseWaitForTransaction(revokePauserRoleTransaction, 'Revoking pauser role');
	const revokeAdminRoleTransaction = await allianceBlockToken.revokeRole(defaultAdminRole, deployerAddress)
	await allianceBlockToken.verboseWaitForTransaction(revokeAdminRoleTransaction, 'Revoking admin role');
	await deployer.deploy(BatchTransfer);

	const percentageCalculator = await deployer.deploy(PercentageCalculator);
	const libraries = {
		PercentageCalculator: percentageCalculator.contractAddress
	}
	//This will be replaced with real data, once provided
	const cumulativeAmountsToVest = ["43333333000000000000000000", "76666666000000000000000000", "93333333000000000000000000", "93333333000000000000000000", "93333333000000000000000000", "15000000000000000000000000", "15000000000000000000000000", "15000000000000000000000000", "15000000000000000000000000", "15000000000000000000000000", "15000000000000000000000000", "30000000000000000000000000", "30000000000000000000000000", "30000000000000000000000000", "40000000000000000000000000", "40000000000000000000000000", "40000000000000000000000000", "50000000000000000000000000", "50000000000000000000000000", "50000000000000000000000000", "60000000000000000000000000", "60000000000000000000000000", "60000000000000000000000000", "75000000000000000000000000"]

	await deployer.deploy(Vesting, libraries, allianceBlockToken.contractAddress, cumulativeAmountsToVest)
};

module.exports = {
	deploy
};