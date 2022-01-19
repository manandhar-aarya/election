const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const electionPath = path.resolve(__dirname, 'contracts', 'Election.sol');
const electionSource = fs.readFileSync(electionPath, 'utf8');
let outputJson = getCompiledOutput(electionSource);

fs.ensureDirSync(buildPath);

fs.outputJsonSync(path.resolve(buildPath, 'Election.json'), outputJson["Election"]);
fs.outputJsonSync(path.resolve(buildPath, 'ElectionFactory.json'), outputJson["ElectionFactory"]);
fs.outputJsonSync(path.resolve(buildPath, 'IVotedToken.json'), outputJson["IVotedToken"]);
fs.outputJsonSync(path.resolve(buildPath, 'Vendor.json'), outputJson["Vendor"]);


function getCompiledOutput(source) {
    let jsonContractSource = JSON.stringify({
        language: 'Solidity', sources: {
            'Task': {
                content: source,
            },
        }, settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', "evm.bytecode"]
                },
            },
        },
    });
    let output = solc.compile(jsonContractSource);
    let outputString = output.replace("/", "");
    return JSON.parse(outputString).contracts.Task;
}

console.log("Compiled files to " + buildPath);