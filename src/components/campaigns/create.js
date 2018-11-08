import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Layout from '../layout';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory-contract';

export default class CreateCampaign extends Component {

    privateKey = '0xb17adaf809359e61dcb349bbe7b9c2a09a4448b1b5b64bd5464232c72dec0a7b';

    state = {
        value: '',
        error: '',
        success: false,
        loading: false
    };

    validateInput() {
        return this.state.value.match(/^[0-9]+$/g);
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ success: false });

        if (!this.validateInput()) {
            this.setState({ error: 'Please enter a correct number!' });
            return;
        }

        const accounts = await web3.eth.getAccounts();

        // checking if metamask is enabled
        if (!accounts[0]) {
            this.setState({ error: 'Please sign in to your metamask account' });
            return;
        }

        this.setState({ error: '', loading: true });

        try {

            let tx_builder = factory.methods.createCampaign(this.state.value);

            let transactionObject = {
                gas: '1000000',
                gasPrice: '20000000000',
                data: tx_builder.encodeABI(),
                from: accounts[0],
                to: '0xE6b8f3093bD0Ae6077436Fa1CC61dE73B4206727'
            };

            web3.eth.accounts.signTransaction(transactionObject, this.privateKey, (error, signedTx) => {
                if (error) {
                    this.setState({ error: error.message });
                } else {
                    web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', function (receipt) {
                        console.log('receipt : ', receipt);
                        this.setState({ success: true });
                    });
                }
            });

            // await factory.methods.createCampaign(this.state.value).send({ from: accounts[0] });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ error: error.message });
        }

        this.setState({ loading: false });
    }

    render() {

        const waitingMessage = this.state.loading ? <Message warning header="Notice!" content="Creating campaign might take 10 to 15 seconds. Please be patient." /> : '';
        const errorMessage = this.state.error ? <Message error header="Error!" content={this.state.error} /> : '';
        const successMessage = this.state.success ? <Message success header="Congrats!" content="Your campaign is created successfully..." /> : '';

        return (
            <Layout>
                <h3>Create New Campaign</h3>
                <Form onSubmit={this.onSubmit} loading={this.state.loading}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input label="wei" labelPosition="right" onChange={event => this.setState({ value: event.target.value })} />
                    </Form.Field>
                    <Button primary>Create!</Button>
                </Form>
                {waitingMessage}
                {errorMessage}
                {successMessage}
            </Layout>
        );
    }
}