const Web3 = require('Web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const compiledFactory = require('./build/Factory.json');

const mnemonic = 'your 12 mnemonic words';
const nodeApiUrl = 'https://ropsten.infura.io/v3/7f9880d8f7ab42c4bf602a3a5b7d6dfd';

const provider = new HDWalletProvider(mnemonic, nodeApiUrl);
const web3 = new Web3(provider);

(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode}).
        send({from: accounts[0], gas: '1000000'});
    
    console.log("Hash of deployed contract : ", factory.options.address);

})();
