import web3 from './web3';
import factory from './build/Factory.json';

const address = '0xE6b8f3093bD0Ae6077436Fa1CC61dE73B4206727'; // ganache

export default new web3.eth.Contract(JSON.parse(factory.interface), address);
