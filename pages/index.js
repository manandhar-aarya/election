import React, {Component} from 'react';
import {Card, Button} from 'semantic-ui-react';
import {Form, Input, Label} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import web3 from '../ethereum/web3';
import {Link} from '../routes';
import Vendor from '../ethereum/vendor';

class ElectionList extends Component {
    state = {
        value: '', errorMessage: '', loading: false, electionData: [], account: ""
    };

    componentDidMount() {
        this.getContractData().then((data) => {
            this.setState({electionData: data.elections, account: data.accounts[0]});
        });
    }

    async getContractData() {
        let accounts = await web3.eth.getAccounts();
        const elections = await factory.methods.getDeployedElections().call();
        const vendorAddress = await factory.methods.vendorAddress.call().call();
        const totalSupply = await Vendor(vendorAddress).methods.totalSupply().call();
        console.log("total token Supply: ", totalSupply)
        const balance1 = await web3.eth.getBalance(vendorAddress);
        console.log("eth balance:", web3.utils.fromWei(balance1, 'ether'));
        return {elections, accounts};
    }

    renderElectionList(electionList) {
        const items = electionList.map(deployedElection => {
            return {
                header: deployedElection.name,
                description: (<Link route={`/elections/${deployedElection.electionAddress}`}>
                    <a>View Election</a>
                </Link>),
                fluid: true
            };
        });

        const accounts = this.state.account;
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            let accoun = "";
            window.ethereum.on('accountsChanged', function (accounts) {
                accoun = accounts[0];
                console.log(accoun);// todo reload page when account is changed
            })
        }
        return <div>
            <Label>Current account : {accounts}</Label>
            <br/><br/>
            <Card.Group items={items}/>
        </div>;

    }

    render() {
        return (<Layout>
            <div>
                {this.renderElectionList(this.state.electionData)}
            </div>
        </Layout>);
    }
}

export default ElectionList;