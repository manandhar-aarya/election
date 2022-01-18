import web3 from './web3';
import ElectionFactory from './build/ElectionFactory.json';

const instance = new web3.eth.Contract(
    ElectionFactory.abi,
  "0x0a742EF7D7f2a6f148a4790Ac430AEcF0521e336"  // electionFactory local
);

export default instance;
