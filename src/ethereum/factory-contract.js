import web3 from './web3';
import factory from './build/Factory.json';

const address = '0x432538Cc245bd90D71D367c9958A4fb9b3AbfAd3'; // rinkeby

export default new web3.eth.Contract(JSON.parse(factory.interface), address);
