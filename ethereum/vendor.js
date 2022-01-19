import web3 from './web3';
import Vendor from './build/Vendor.json';

export default address => {
    return new web3.eth.Contract(Vendor.abi, address);
};
