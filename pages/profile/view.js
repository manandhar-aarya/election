import React, {Component} from 'react';
import {Card, Grid, Button} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import factory from "../../ethereum/factory";
import Vendor from "../../ethereum/vendor";

class ProfileShow extends Component {
    static getInitialProps({query}) {
        return {query}
    }

    state = {
        value: '', errorMessage: '', loading: false, balance: 0, vendorAddress: "", vendorBalance: 0
    };

    componentDidMount() {
        this.getContractData().then((data) => {
            this.setState({
                balance: data.balance,
                vendorAddress: data.vendorAddress,
                vendorBalance: data.vendorBalance
            });
        });
    }

    async getContractData() {
        let accounts = await web3.eth.getAccounts();
        const vendorAddress = await factory.methods.vendorAddress.call().call();
        const balance = await Vendor(vendorAddress).methods.balanceOf(accounts[0]).call();
        const vendorBalance = await Vendor(vendorAddress).methods.balanceOf(vendorAddress).call();
        return {
            vendorBalance: vendorBalance,
            vendorAddress: vendorAddress,
            balance: balance,
        };
    }

    render() {
        return (
            <Layout>
                <h3>Balance: {this.state.balance} iVoted Tokens </h3>
                <h3>Vendor Balance: {this.state.vendorBalance} iVoted Tokens </h3>

                <Button primary onClick={this.onBuy}>Buy</Button>
                <Button primary onClick={this.onSell}>Sell</Button>

            </Layout>
        );
    }

    onBuy = async () => {
        try {
            let accounts = await web3.eth.getAccounts();
            await Vendor(this.state.vendorAddress).methods.buyTokens(1).send({
                from: accounts[0],
                value: web3.utils.toWei("0.0001", 'ether')
            });
        } catch (err) {
            console.log(err);
        }
    }

    onSell = async () => {
        try {
            let accounts = await web3.eth.getAccounts();
            await Vendor(this.state.vendorAddress).methods.sellTokens(1).send({
                from: accounts[0]
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export default ProfileShow;