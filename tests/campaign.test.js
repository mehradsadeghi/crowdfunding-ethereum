const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache-cli');
const campaignContract = require('../src/ethereum/build/Campaign.json');
const factoryContract = require('../src/ethereum/build/Factory.json');

const web3 = new Web3(ganache.provider());

let accounts;
let campaign;
let factory;


beforeEach(async () => {

	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(factoryContract.interface))
		.deploy({ data: factoryContract.bytecode }).
		send({ from: accounts[0], gas: '1000000' });

	await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' });

	[deployedCampaignAddress] = await factory.methods.getDeployedCampaigns().call();

	campaign = await new web3.eth.Contract(JSON.parse(campaignContract.interface), deployedCampaignAddress);
});

describe('Campaigns', () => {

	it('deploys campaign and factory contracts', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
		console.log(campaign.options.address);
	});

	it('the initializer is the manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(manager, accounts[0])
	});

	it('can contribute to the campaign and marks them as contributer', async () => {
		await campaign.methods.contribute().send({ from: accounts[0], value: '200' });
		const isContributer = await campaign.methods.contributers(accounts[0]).call();
		assert(isContributer);
	});

	it('requires a minimum contribution', async () => {

		try {
			await campaign.methods.contribute().send({ from: accounts[0], value: '10' });
		} catch (error) {
			assert(error);
			return;
		}

		assert(false);
	});

	it('allows manager to make a payment request', async () => {

		await campaign.methods.makeRequest('A', '100', accounts[1]).send({ from: accounts[0], gas: '1000000' });
		const request = await campaign.methods.requests(0).call();
		assert.equal(request.description, 'A');

	});
});