import web3 from './web3';
import IVotedToken from './build/IVotedToken.json';

export default address => {
    return new web3.eth.Contract(IVotedToken.abi, address);
};
