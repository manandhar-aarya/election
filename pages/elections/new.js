import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';

class NewElection extends Component {
    state = {
        tokens: 0,
        errorMessage: '',
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();

        // this.setState({loading: true, errorMessage: ''});

        try {
            const accounts = await web3.eth.requestAccounts();
            await factory.methods //(bytes32[] memory candidateNameList, uint totalVoters
                .createElection(["aarya", "manandhar"] ,30)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute('/');
        } catch (err) {
            console.log(err);
            // this.setState({errorMessage: err.message});
        }

        // this.setState({loading: false});
    };

    render() {
        return (
            <Layout>
                <h3>Create an Election</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Tokens to mint</label>
                        <Input
                            label="tokens"
                            labelPosition="right"
                            value={this.state.tokens}
                            onChange={event => this.setState({tokens: event.target.value})}
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button loading={this.state.loading} primary>
                        Create!
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default NewElection;
