import web3 from './web3';
import factory from './build/Factory.json';

// 0x80C2D92200160a87d114a0F7B09f6498f3EE852c => ropsten
const address = '0x39ec0CE8437B5916632221F353BaE180dD3fFD11'; // rinkeby

export default new web3.eth.Contract(JSON.parse(factory.interface), address);
