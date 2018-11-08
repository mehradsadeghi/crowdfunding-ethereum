import Web3 from 'web3';

let web3;

// if (typeof window.web3 === 'undefined') {
//     const provider = new Web3.providers.HttpProvider('provider-url-with-cors-access');
//     web3 = new Web3(provider);
// } else {
//     web3 = new Web3(window.web3.currentProvider);
// }

const networkAddress = 'http://127.0.0.1:7545';
const provider = new Web3.providers.HttpProvider(networkAddress);
web3 = new Web3(provider);

export default web3;