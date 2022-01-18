const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Election.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

let jsonContractSource = JSON.stringify({
    language: 'Solidity',
    sources: {
        'Task': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', "evm.bytecode"]
            },
        },
    },
});
let output = solc.compile(jsonContractSource);
let outputString = output.replace("/", "");
let outputJson = JSON.parse(outputString).contracts.Task;

fs.ensureDirSync(buildPath);

fs.outputJsonSync(
    path.resolve(buildPath, 'Election.json'),
    outputJson["Election"]
);

fs.outputJsonSync(
  path.resolve(buildPath, 'ElectionFactory.json'),
  outputJson["ElectionFactory"]
);

console.log("Compiled files to " + buildPath);