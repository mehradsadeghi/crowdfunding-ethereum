const solc = require('solc');
const fs = require('fs-extra');
const path = require('path');

const buildPath = path.resolve(__dirname, 'build');

if (fs.existsSync(buildPath)) {
	fs.removeSync(buildPath);
}

const campaignContractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const campaignContractSource = fs.readFileSync(campaignContractPath, 'utf8');
const campaignContractCompiled = solc.compile(campaignContractSource, 1);

const contracts = campaignContractCompiled.contracts;

for (let contract in contracts) {
	fs.outputJsonSync(
		path.resolve(buildPath, `${contract.substr(1)}.json`),
		contracts[contract]
	);
}

