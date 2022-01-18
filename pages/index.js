import React, {Component} from 'react';
import {Card, Button} from 'semantic-ui-react';
import {Form, Input, Label} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import web3 from '../ethereum/web3';
import {Link} from '../routes';

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
        const admin = await factory.methods.admin.call().call();
        console.log(admin)
        return {elections, accounts};
    }

    renderElectionList(electionList) {
        const items = electionList.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/elections/${address}`}>
                        <a>View Election</a>
                    </Link>
                ), fluid: true
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
            <Card.Group items={items}/>
        </div>;

    }

    account = "";
    onSubmit = () => {
        this.saveData().then(() => {
            this.setState({account: this.account});
        })
    };

    async saveData() {
        try {
            const accounts = await web3.eth.requestAccounts();
            this.account = accounts[0];
            console.log(accounts[0])
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (<Layout>
            <div>
                <Button onClick={this.onSubmit}>
                    log address
                </Button>
                {this.renderElectionList(this.state.electionData)}
            </div>
        </Layout>);
    }
}

export default ElectionList;