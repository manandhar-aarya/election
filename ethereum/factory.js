import web3 from './web3';
import ElectionFactory from './build/ElectionFactory.json';

const instance = new web3.eth.Contract(
    ElectionFactory.abi,
    // "0x0a742EF7D7f2a6f148a4790Ac430AEcF0521e336"  // electionFactory local
    // "0xfD4D811B0b82eC6BAA393bcd89255eADc101db45"
    // "0x9c9825E0dd4E87612D679ccA6d89542080ce7749"
    // "0xd00b4C5d29b76560Bf719Fa1B42E06918783a676"
    "0x09Dfeda465fad49ff1C223C9B35784FDc58e7a93"
);

export default instance;
