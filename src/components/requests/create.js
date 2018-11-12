import React, { Component } from 'react';
import Layout from '../layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Campaign from '../../ethereum/campaign-contract';
import web3 from '../../ethereum/web3';
import { signAndSendTransaction } from '../../ethereum/helpers';
import PrivateKeyModal from '../private-key-modal/private-key-modal';
import { decode } from '../helpers';

export default class CampaignsCreateRequest extends Component {

	constructor(props) {
		super(props);

		this.address = this.props.match.params.address;

		this.state = {
			description: '',
			recipient: '',
			value: '',
			error: '',
			success: false,
			loading: false,
			privateKeyModal: false
		};
	}

	validateInput() {
		const value = this.state.value.match(/^[0-9.]+$/g);
		const recipient = this.state.recipient.match(/^0x[a-fA-F0-9]{40}$/g);
		const description = this.state.description.match(/^.+$/g);
		return value && recipient && description;
	}

	closeModal = () => this.setState({ privateKeyModal: false });

	onSubmit = async event => {
		event.preventDefault();

		this.setState({ success: false });

		if (!this.validateInput()) {
			this.setState({ error: 'Please enter correct data!' });
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

		let { description, value, recipient } = this.state;
		value = web3.utils.toWei(value, 'ether');

		const campaign = Campaign(this.address);

		try {
			const makeRequest = await campaign.methods.makeRequest(description, value, recipient);

			const options = {
				to: makeRequest._parent._address,
				data: makeRequest.encodeABI(),
				gas: '1000000'
			};

			await signAndSendTransaction(options, privateKey);

			this.setState({ success: true });
		} catch (error) {
			this.setState({ error: error.message });
		}

		this.setState({ loading: false });
	};

	render() {

		const waitingMessage = this.state.loading ? <Message warning header="Notice!" content="Creating request might take 10 to 15 seconds. Please be patient." /> : '';
		const errorMessage = this.state.error ? <Message error header="Error!" content={this.state.error} /> : '';
		const successMessage = this.state.success ? <Message success header="Congrats!" content="Your request is created successfully." /> : '';
		const privateKeyModal = this.state.privateKeyModal ? <PrivateKeyModal closeModal={this.closeModal} /> : '';

		return (
			<Layout>
				<h3>Create Request</h3>
				<Form onSubmit={this.onSubmit} loading={this.state.loading}>
					<Form.Field>
						<label>Description</label>
						<Input onChange={event => this.setState({ description: event.target.value })} />
					</Form.Field>
					<Form.Field>
						<label>Amount (Value)</label>
						<Input label="ether" labelPosition="right" onChange={event => this.setState({ value: event.target.value })} />
					</Form.Field>
					<Form.Field>
						<label>Recipient Address</label>
						<Input onChange={event => this.setState({ recipient: event.target.value })} />
					</Form.Field>
					<Button primary>Create!</Button>
					<Link to={`/campaigns/${this.address}/requests`}>
						<Button>Back</Button>
					</Link>
				</Form>
				{waitingMessage}
				{errorMessage}
				{successMessage}
				{privateKeyModal}
			</Layout>
		);
	}
}