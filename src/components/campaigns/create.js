import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Layout from '../layout';
import factory from '../../ethereum/factory-contract';
import { signAndSendTransaction } from '../../ethereum/helpers';
import PrivateKeyModal from '../private-key-modal/private-key-modal';
import { decode } from '../helpers';

export default class CreateCampaign extends Component {

    state = {
        value: '',
        error: '',
        success: false,
        loading: false,
        privateKeyModal: false,
    };

    validateInput() {
        return this.state.value.match(/^[0-9]+$/g);
    }

    closeModal = () => this.setState({ privateKeyModal: false });

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ success: false });

        if (!this.validateInput()) {
            this.setState({ error: 'Please enter a correct number!' });
            return;
        }

        let privateKey = sessionStorage.getItem('pkencoded');

        if (!privateKey) {
            this.setState({ privateKeyModal: true });
            return;
        } else {
            privateKey = decode(privateKey);
        }

        this.setState({ error: '', loading: true });

        try {

            const createCampaign = await factory.methods.createCampaign(this.state.value);

            const options = {
                to: createCampaign._parent._address,
                data: createCampaign.encodeABI(),
                gas: '1000000'
            };

            await signAndSendTransaction(options, privateKey);

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
        const privateKeyModal = this.state.privateKeyModal ? <PrivateKeyModal closeModal={this.closeModal} /> : '';

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
                {privateKeyModal}
            </Layout>
        );
    }
}