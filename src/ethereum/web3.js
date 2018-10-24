import Web3 from 'web3';

let web3;

if (typeof window.web3 === 'undefined') {
    const provider = new Web3.providers.HttpProvider('provider-url-with-cors-access');
    web3 = new Web3(provider);
} else {
    web3 = new Web3(window.web3.currentProvider);
}

export default web3;