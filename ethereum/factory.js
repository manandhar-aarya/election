import web3 from './web3';
import ElectionFactory from './build/ElectionFactory.json';

const instance = new web3.eth.Contract(
    ElectionFactory.abi,
    // "0x009D11A73aA3d9e61aE1c54d007823Cc2Dc152f5" // local
    "0x54b6F20B4360401576075607f0ba52479a7f3F2f" // rinkeby
);

export default instance;
