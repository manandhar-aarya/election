import web3 from './web3';
import ElectionFactory from './build/ElectionFactory.json';

const instance = new web3.eth.Contract(
    ElectionFactory.abi,
    // "0x0a742EF7D7f2a6f148a4790Ac430AEcF0521e336"  // electionFactory local
    // "0xfD4D811B0b82eC6BAA393bcd89255eADc101db45"
    // "0x9c9825E0dd4E87612D679ccA6d89542080ce7749"
    // "0xd00b4C5d29b76560Bf719Fa1B42E06918783a676"
    // "0x09Dfeda465fad49ff1C223C9B35784FDc58e7a93"
    // "0x2c73F9C50883A4E7176827CE017bf7386409b8A2"
// "0xDeabc476452cc684b0bAd171cCC7Bc513f13E7D6"
// "0x6F872D27805B457A283E0A3DF6ccC098e49D7f0D"
//     "0x3bdBCb5fc4DD45F80273B47f0504B85958591399"
// "0xFa81aeA5d740545ABe4C9D146033d4d8E08Cc898"
    "0x5166Ce719B29F929794773d3Fb4DDEE0Fa0f9382"
);

export default instance;
