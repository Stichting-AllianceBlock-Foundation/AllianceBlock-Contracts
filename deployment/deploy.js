const etherlime = require('etherlime-lib');
const AllianceBlockToken = require('../build/AllianceBlockToken.json');


const deploy = async (network, secret, etherscanApiKey) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const result = await deployer.deploy(AllianceBlockToken);

};

module.exports = {
	deploy
};