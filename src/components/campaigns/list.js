import React, { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import factory from '../../ethereum/factory-contract';
import Layout from '../layout';

export default class CampaignsList extends Component {

    state = {
        campaigns: []
    };

    async componentDidMount() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        this.setState({ campaigns });
    }

    renderCards() {

        if (this.state.campaigns.length === 0) {
            return <h3>Loading...</h3>
        }

        const items = this.state.campaigns.map((campaignAddress, index) =>
            <Card
                key={index}
                fluid
                header={campaignAddress}
                description={<Link to={`/campaigns/${campaignAddress}`}>Show Details</Link>}
            />
        );
        return <Card.Group>{items}</Card.Group>
    }

    render() {

        return (
            <Layout>
                <h3>Campaigns List</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Link to={`/campaigns/create`}>
                                <Button floated="right" primary>Create Campaign</Button>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}
