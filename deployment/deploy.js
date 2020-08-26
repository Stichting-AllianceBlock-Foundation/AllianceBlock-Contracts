const etherlime = require('etherlime-lib');
const AllianceBlockToken = require('../build/AllianceBlockToken.json');
const BatchTransfer = require('../build/BatchTransfer.json');

const deploy = async (network, secret, etherscanApiKey) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const allianceBlockToken = await deployer.deploy(AllianceBlockToken);
	await deployer.deploy(BatchTransfer, {}, allianceBlockToken.contract.address);
};

module.exports = {
	deploy
};