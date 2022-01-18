const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const compiledFactory = require('./build_new/CampaignFactory.json');

const provider = new HDWalletProvider(
    "divide edge tilt sister ten total cannon garment photo edge dream fire",
    "https://rinkeby.infura.io/v3/95d9e004f77548fdbdd9980deddb5f43"
);
const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Attempting to deploy from account', accounts[0]);
        const result = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({data: compiledFactory.evm.bytecode.object})
            .send({gas: '2900000', from: accounts[0]});
        console.log('Contract deployed to', result.options.address);
    } catch (e) {
        console.log(e.message)
    }
};
deploy();