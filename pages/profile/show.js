import React, {Component} from 'react';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import factory from "../../ethereum/factory";
import Vendor from "../../ethereum/vendor";

class ProfileShow extends Component {
    static getInitialProps({query}) {
        return {query}
    }

    state = {
        value: '',
        errorMessage: '',
        loading: false,
        balance: 0,
        vendorAddress: "",
        vendorBalance: 0,
        tokensToBuy: 0,
        tokensToSell: 0,
        pricePerToken: 0
    };

    componentDidMount() {
        this.getContractData().then((data) => {
            this.setState({
                balance: data.balance,
                vendorAddress: data.vendorAddress,
                vendorBalance: data.vendorBalance,
                pricePerToken: data.pricePerToken
            });
        });
    }

    async getContractData() {
        let accounts = await web3.eth.getAccounts();
        const vendorAddress = await factory.methods.vendorAddress.call().call();
        const vendor = await Vendor(vendorAddress);
        const balance = await vendor.methods.balanceOf(accounts[0]).call();
        const vendorBalance = await vendor.methods.balanceOf(vendorAddress).call();
        const tokensPerEth = await vendor.methods.tokensPerEth.call().call();
        let pricePerToken = 0;
        if (tokensPerEth) {
            pricePerToken = 1 / Number( tokensPerEth);
        }
        return {
            vendorBalance: vendorBalance,
            vendorAddress: vendorAddress,
            balance: balance,
            pricePerToken: pricePerToken,
        };
    }

    render() {
        return (<Layout>
            <h3>Balance: {this.state.balance} iVoted Tokens </h3>

            <Form error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Tokens to buy ({this.state.vendorBalance} tokens available)</label>
                    <Input label="Tokens" labelPosition="right" value={this.state.tokensToBuy}
                           onChange={event => this.setState({tokensToBuy: event.target.value})}/>
                    <label>ETH {Number(this.state.tokensToBuy) * Number(this.state.pricePerToken)}</label>
                    <Button loading={this.state.loading} primary onClick={this.onBuy}>Buy</Button>

                    <br/><br/><br/>

                    <label>Tokens to sell</label>
                    <Input label="Tokens" labelPosition="right" value={this.state.tokensToSell}
                           onChange={event => this.setState({tokensToSell: event.target.value})}/>
                    <label>ETH {Number(this.state.tokensToSell) * Number(this.state.pricePerToken)}</label>
                    <Button loading={this.state.loading} primary onClick={this.onSell}>Sell</Button>

                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage}/>

            </Form>


        </Layout>);
    }

    // todo check if i need to add gas amount
    onBuy = async () => {
        const balance = Number(this.state.vendorBalance);
        const tokens = Number(this.state.tokensToBuy);
        if (tokens > balance) {
            this.setState({errorMessage: "Only " + this.state.vendorBalance + " tokens are available at the moment"})
            return;
        }
        try {
            let accounts = await web3.eth.getAccounts();
            await Vendor(this.state.vendorAddress).methods.buyTokens(this.state.tokensToBuy).send({
                from: accounts[0], value: web3.utils.toWei((Number(this.state.tokensToBuy) * Number(this.state.pricePerToken)).toString(), 'ether')
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    onSell = async () => {
        try {
            let accounts = await web3.eth.getAccounts();
            await Vendor(this.state.vendorAddress).methods.sellTokens(this.state.tokensToSell).send({
                from: accounts[0]
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }
}

export default ProfileShow;