import web3 from '../../ethereum/web3';

export async function signAndSendTransaction(options, privateKey) {
    let signedTransaction = await web3.eth.accounts.signTransaction(options, privateKey);
    await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
}