import React, { Component } from 'react';
import { Modal, Input, Button, Message } from 'semantic-ui-react';
import { encode } from '../helpers';

export default class PrivateKeyModal extends Component {

    state = {
        modalSize: 'tiny',
        error: '',
        privateKey: ''
    };

    onModalChange = event => this.setState({ privateKey: event.target.value });

    onSubmitPrivateKey = () => {

        this.setState({ error: '' });

        let privateKey = this.state.privateKey;

        const firstTowChars = privateKey.substr(0, 2);

        if (firstTowChars !== '0x') {
            privateKey = `0x${privateKey}`;
        }

        let validation = privateKey.match(/^0x[a-fA-F0-9]{64}$/g);

        if (!validation) {
            this.setState({ error: 'Please enter a valid private key' });
        } else {
            sessionStorage.setItem('pkencoded', encode(privateKey));
            this.props.closeModal();
        }
    }

    render() {

        const errorMessage = this.state.error ? <Message error content={this.state.error} /> : '';

        return (
            <Modal size={this.modalSize} open={true} onClose={this.props.closeModal}>
                <Modal.Header>Please Enter Your Private Key</Modal.Header>
                <Modal.Content>
                    <Input placeholder="Example : 0x1c0247fe3b0a8ab339eedccdb269732d4436e617f2f35d4060320107332b2570" fluid onChange={this.onModalChange} />
                    {errorMessage}
                </Modal.Content>
                <Modal.Actions>
                    <Button basic onClick={this.props.closeModal}>Cancel</Button>
                    <Button positive onClick={this.onSubmitPrivateKey} content='OK' />
                </Modal.Actions>
            </Modal>
        );
    }
}