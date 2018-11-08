const Web3 = require('Web3');
const compiledFactory = require('./build/Factory.json');

const privateKey = 'b17adaf809359e61dcb349bbe7b9c2a09a4448b1b5b64bd5464232c72dec0a7b'; //ganache
const networkAddress = 'http://127.0.0.1:7545';

const provider = new Web3.providers.HttpProvider(networkAddress);
const web3 = new Web3(provider);
const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);

(async () => {

    try {

        factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({ data: compiledFactory.bytecode })
            .send({ from: account.address, gas: '1000000' });

        console.log("Hash of deployed contract : ", factory.options.address);
    } catch (error) {
        console.log(error.message);
    }
})();
