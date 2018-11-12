import React, { Component } from 'react';
import { Button, Table, Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Layout from '../layout';
import Campaign from '../../ethereum/campaign-contract';
import web3 from '../../ethereum/web3';
import { signAndSendTransaction } from '../../ethereum/helpers';
import PrivateKeyModal from '../private-key-modal/private-key-modal';
import { decode } from '../helpers';

export default class CampaignsRequests extends Component {

	constructor(props) {
		super(props);
		this.address = this.props.match.params.address;
		this.campaign = Campaign(this.address);
		this.state = {
			requests: [],
			contributesCount: 0,
			error: '',
			success: false,
			waiting: false,
			loading: {
				data: false,
				approve: {},
				finalize: {}
			},
			message: '',
			privateKeyModal: false,
		};
	}

	async componentDidMount() {
		const contributesCount = await this.campaign.methods.contributersCount().call();
		const requestsCount = await this.campaign.methods.getRequestsCount().call();
		let requests = [];

		for (let i = 0; i < requestsCount; i++) {
			let request = await this.campaign.methods.requests(i).call();
			requests.push(request);
		}

		this.setState({ requests, contributesCount });
	}

	renderRequestsRows() {

		return this.state.requests.map((request, index) => {

			return (
				<Table.Row key={index} disabled={request.complete}>
					<Table.Cell>{index}</Table.Cell>
					<Table.Cell>{request.description}</Table.Cell>
					<Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
					<Table.Cell>{request.recipient}</Table.Cell>
					<Table.Cell>{request.approvalsCount} / {this.state.contributesCount}</Table.Cell>
					{
						request.complete ? null : (
							<Table.Cell>
								<Button basic positive onClick={() => this.onApprove(index)} loading={this.state.loading.approve[index]} disabled={this.state.loading.approve[index]}>Approve</Button>
							</Table.Cell>
						)
					}
					{
						request.complete ? null : (
							<Table.Cell>
								<Button basic color="teal" onClick={() => this.onFinalize(index)} loading={this.state.loading.finalize[index]} disabled={this.state.loading.finalize[index]}>Finalize</Button>
							</Table.Cell>
						)
					}
				</Table.Row>
			);
		});
	}

	closeModal = () => this.setState({ privateKeyModal: false });

	onApprove = async index => {

		this.setState({ success: false });

		let privateKey = sessionStorage.getItem('pkencoded');

		if (!privateKey) {
			this.setState({ privateKeyModal: true });
			return;
		} else {
			privateKey = decode(privateKey);
		}

		let loading = this.state.loading;
		loading.approve[index] = true;
		this.setState({ error: '', loading: loading, waiting: true, message: 'Approving' });

		try {

			const approveRequest = await this.campaign.methods.approveRequest(index);

			const options = {
				to: approveRequest._parent._address,
				data: approveRequest.encodeABI(),
				gas: '1000000'
			};

			await signAndSendTransaction(options, privateKey);

			this.setState({ success: true });
		} catch (error) {
			this.setState({ error: error.message });
		}

		loading.approve[index] = false;
		this.setState({ loading, waiting: false });
	};

	onFinalize = async index => {
		this.setState({ success: false });

		let privateKey = sessionStorage.getItem('pkencoded');

		if (!privateKey) {
			this.setState({ privateKeyModal: true });
			return;
		} else {
			privateKey = decode(privateKey);
		}

		let loading = this.state.loading;
		loading.finalize[index] = true;
		this.setState({ error: '', loading: loading, waiting: true, message: 'Finalizing' });

		try {

			const finalizeRequest = await this.campaign.methods.finalizeRequest(index);

			const options = {
				to: finalizeRequest._parent._address,
				data: finalizeRequest.encodeABI(),
				gas: '1000000'
			};

			await signAndSendTransaction(options, privateKey);

			this.setState({ success: true });
		} catch (error) {
			this.setState({ error: error.message });
		}

		loading.finalize[index] = false;
		this.setState({ loading, waiting: false });
	};

	render() {

		const waitingMessage = this.state.waiting ? <Message warning header="Notice!" content={`${this.state.message} the request might take 10 to 15 seconds. Please be patient.`} /> : '';
		const errorMessage = this.state.error ? <Message error header="Error!" content={this.state.error} /> : '';
		const successMessage = this.state.success ? <Message success header="Congrats!" content={`${this.state.message} the request is done.`} /> : '';
		const fetchingMessage = this.state.requests.length === 0 ? <h3>Nothing yet...</h3> : '';
		const privateKeyModal = this.state.privateKeyModal ? <PrivateKeyModal closeModal={this.closeModal} /> : '';

		return (
			<Layout>
				<Grid>
					<Grid.Row>
						<Grid.Column>
							<h3 style={{ display: 'inline-block' }}>Requests List</h3>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Link to={`/campaigns/${this.address}/requests/create`}>
								<Button primary floated="right">Create Request</Button>
							</Link>
							<Link to={`/campaigns/${this.address}`}>
								<Button>Back</Button>
							</Link>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>ID</Table.HeaderCell>
										<Table.HeaderCell>Description</Table.HeaderCell>
										<Table.HeaderCell>Amount (ether)</Table.HeaderCell>
										<Table.HeaderCell>Recipient</Table.HeaderCell>
										<Table.HeaderCell>Approval Count</Table.HeaderCell>
										<Table.HeaderCell>Approve</Table.HeaderCell>
										<Table.HeaderCell>Finalize</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{this.renderRequestsRows()}
								</Table.Body>
							</Table>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				{fetchingMessage}
				{waitingMessage}
				{errorMessage}
				{successMessage}
				{privateKeyModal}
			</Layout>
		);
	}
}
