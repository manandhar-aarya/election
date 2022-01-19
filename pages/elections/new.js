import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import Vendor from "../../ethereum/vendor";

class NewElection extends Component {
    state = {
        tokens: 0,
        errorMessage: '',
        loading: false,
        name: "",
        candidate1: "",
        candidate2: "",
        candidate3: "",
        candidate4: "",
        numberOfTokens: 0,
        pricePerToken: 0
    };

    componentDidMount() {
        this.getContractData().then((data) => {
            this.setState({pricePerToken: data.pricePerToken});
        });
    }

    async getContractData() {
        const vendorAddress = await factory.methods.vendorAddress.call().call();
        const vendor = await Vendor(vendorAddress);
        const tokensPerEth = await vendor.methods.tokensPerEth.call().call();
        let pricePerToken = 0;
        if (tokensPerEth) {
            pricePerToken = 1 / Number(tokensPerEth);
        }
        return {pricePerToken: pricePerToken};
    }

    onSubmit = async () => {

        this.setState({loading: true, errorMessage: ''});
        const candidateList = [];
        if (typeof this.state.candidate1 !== 'undefined' && this.state.candidate1 !== "") {
            candidateList.push(this.state.candidate1)
        }
        if (typeof this.state.candidate2 !== 'undefined' && this.state.candidate2 !== "") {
            candidateList.push(this.state.candidate2)
        }
        if (typeof this.state.candidate3 !== 'undefined' && this.state.candidate3 !== "") {
            candidateList.push(this.state.candidate3)
        }
        if (typeof this.state.candidate4 !== 'undefined' && this.state.candidate4 !== "") {
            candidateList.push(this.state.candidate4)
        }
        if (candidateList.length < 1) {
            this.setState({loading: false, errorMessage: "Please add at least 1 candidate!"});
        }

        try {
            const accounts = await web3.eth.requestAccounts();
            await factory.methods
                .createElection(this.state.name, candidateList, this.state.numberOfTokens)
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei((Number(this.state.numberOfTokens) * Number(this.state.pricePerToken)).toString(), 'ether')
                });

            Router.pushRoute('/');
        } catch (err) {
            console.log(err);
            this.setState({errorMessage: err.message});
        }

        this.setState({loading: false});
    };

    render() {
        return (<Layout>
            <h3>Create an Election</h3>

            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Name of Election</label>
                    <Input value={this.state.name}
                           onChange={event => this.setState({name: event.target.value})}/>
                    <br/><br/><br/>
                    <label>Candidate 1</label>
                    <Input value={this.state.candidate1}
                           onChange={event => this.setState({candidate1: event.target.value})}/>

                    <label>Candidate 2</label>
                    <Input value={this.state.candidate2}
                           onChange={event => this.setState({candidate2: event.target.value})}/>

                    <label>Candidate 3</label>
                    <Input value={this.state.candidate3}
                           onChange={event => this.setState({candidate3: event.target.value})}/>

                    <label>Candidate 4</label>
                    <Input value={this.state.candidate4}
                           onChange={event => this.setState({candidate4: event.target.value})}/>
                    <br/><br/><br/>
                    <label>Tokens to mint</label>
                    <Input label="tokens" labelPosition="right" value={this.state.numberOfTokens}
                           onChange={event => this.setState({numberOfTokens: event.target.value})}/>
                    <label>ETH {Number(this.state.numberOfTokens) * Number(this.state.pricePerToken)}</label>

                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage}/>
                <Button loading={this.state.loading} primary>
                    Create
                </Button>
            </Form>
        </Layout>);
    }
}

export default NewElection;
