import web3 from './web3';
import ElectionFactory from './build/ElectionFactory.json';

const instance = new web3.eth.Contract(
    ElectionFactory.abi,
    // "0x09Dfeda465fad49ff1C223C9B35784FDc58e7a93" // local
    "0xFa81aeA5d740545ABe4C9D146033d4d8E08Cc898" // rinkeby
);

export default instance;
