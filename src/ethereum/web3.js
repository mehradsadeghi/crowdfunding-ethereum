const config = require('./config');
const Web3 = require('web3');

const networkMode = 'rinkeby';

const port = config.network[networkMode].port;

const networkAddress = `${config.network[networkMode].protocol}://${config.network[networkMode].host}${port ? `:${port}` : ''}`;
const provider = new Web3.providers.HttpProvider(networkAddress);
const web3 = new Web3(provider);

module.exports = web3;