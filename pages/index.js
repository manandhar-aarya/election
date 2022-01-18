import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class ElectionList extends Component {
    static async getInitialProps() {
        return 1;
    }

    render() {
        return (
            <div className="container"></div>
        )
    }

}

export default ElectionList;