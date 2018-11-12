const compiledFactory = require('./build/Factory.json');
const web3 = require('./web3');

const privateKey = 'your private key';

(async () => {
    try {

        factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({ data: `0x${compiledFactory.bytecode}` });

        let options = {
            data: factory.encodeABI(),
            gas: '2000000'
        };

        let signedTransaction = await web3.eth.accounts.signTransaction(options, privateKey);
        const deploy = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        console.log("Address of deployed contract : ", deploy.contractAddress);
    } catch (error) {
        console.log('error : ', error.message);
    }
})();
