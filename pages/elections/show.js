import React, {Component} from 'react';
import {Card, Grid, Button} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Election from '../../ethereum/election';
import web3 from '../../ethereum/web3';

class ElectionShow extends Component {
    static getInitialProps({query}) {
        return {query}
    }
    state = {
        value: '', errorMessage: '', loading: false, candidateList: [], voterCount: 0, name:""
    };

    componentDidMount() {
        this.getContractData().then((data) => {
            this.setState({candidateList: data.candidateList, voterCount: data.voterCount, name:data.name});
        });
    }
    //todo show contract error elegantly

    async getContractData() {
        const election = Election(this.props.query.address);
        const voterCount = await election.methods.voterCount.call().call()
        const name = await election.methods.name.call().call()
        const candidateCount = await election.methods.candidateCount.call().call()
        const candidates = []
        for (let i = 0; i < candidateCount; i++) {
            const candidate = await election.methods.candidateList(i).call()
            candidates.push({name: candidate.name, voteCount: candidate.voteCount})
        }

        return {
            name:name,
            candidateList: candidates,
            voterCount: voterCount,
        };
    }

    renderCards() {
        const candidateList = this.state.candidateList;
        const voterCount = this.state.voterCount;
        const items = [
            {
                header: voterCount,
                meta: 'Number of Voters',
                description:
                    'Number of people who voted in this election',
                style: {overflowWrap: 'break-word'}
            }
        ];

        const candidates = candidateList.map((candidate) => {
            return {
                header: candidate.name,
                description: "Number of votes: " + candidate.voteCount
                , fluid: true
            };
        })
        return <div>
            <Card.Group items={items}/>
            <Card.Group items={candidates}/>
        </div>;
    }

    render() {


        return (
            <Layout>
                <h3>{this.state.name}</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

                        {/*<Grid.Column width={6}>*/}
                        {/*    <ContributeForm address={ this.props.query.address} />*/}
                        {/*</Grid.Column>*/}
                    </Grid.Row>
                    <Button primary onClick={this.onVote}>View Requests</Button>

                </Grid>
            </Layout>
        );
    }

    onVote = async () => {
        try {
            console.log("vote")
            const election = Election(this.props.query.address);
            const accounts = await web3.eth.requestAccounts();
            await election.methods.vote(0).send({
                from: accounts[0]
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export default ElectionShow;
