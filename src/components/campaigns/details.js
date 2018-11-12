import React, { Component } from 'react';
import Layout from '../layout';
import { Grid, Card, Form, Button, Input, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Campaign from '../../ethereum/campaign-contract';
import web3 from '../../ethereum/web3';
import { signAndSendTransaction } from '../../ethereum/helpers';
import PrivateKeyModal from '../private-key-modal/private-key-modal';
import { decode } from '../helpers';

export default class CampaignsDetails extends Component {

	constructor(props) {
		super(props);

		this.address = this.props.match.params.address;

		this.state = {
			minimumContribution: '',
			balance: '',
			requestsCount: '',
			contributersCount: '',
			manager: '',
			value: '',
			error: '',
			privateKeyModal: false,
			success: false,
			loading: false
		};
	}

	async componentDidMount() {

		const campaign = Campaign(this.address);
		const summary = await campaign.methods.getSummary().call();

		this.setState({
			minimumContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			contributersCount: summary[3],
			manager: summary[4]
		});
	}

	renderCards() {

		if (!this.state.minimumContribution) {
			return <h3>Loading...</h3>;
		}

		const items = [
			{
				header: <div className="header" style={{ overflowWrap: 'break-word' }}>{this.state.manager}</div>,
				description: 'The manager creates this campaign and can create requests to withdraw money',
				meta: 'Address of Manager'
			},
			{
				header: this.state.minimumContribution,
				description: 'You must contribute at least this much wei to become an approver',
				meta: 'Minimum Contribution (wei)'
			},
			{
				header: this.state.requestsCount,
				description: 'A request tries to withdraw money from the contract. Requests must be approved by the contributers',
				meta: 'Number of Requests'
			},
			{
				header: this.state.contributersCount,
				description: 'Number of people who have already donated to this campaign',
				meta: 'Number of Contributers'
			},
			{
				header: web3.utils.fromWei(this.state.balance, 'ether'),
				description: 'The balance is how much money this campaign has left to spend',
				meta: 'Campaign Balance (ether)'
			},
		];

		return <Card.Group items={items} />;
	}

	renderContributionForm() {
		return (
			<Form onSubmit={this.onContribute} loading={this.state.loading}>
				<Form.Field>
					<label>Amount to Contribute</label>
					<Input label="ether" labelPosition="right" onChange={event => this.setState({ value: event.target.value })} />
				</Form.Field>
				<Button primary>Contribute!</Button>
			</Form>
		);
	}

	validateInput() {
		return this.state.value.match(/^[0-9.]+$/g);
	}

	closeModal = () => this.setState({ privateKeyModal: false });

	onContribute = async event => {
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

		const campaign = Campaign(this.address);

		try {

			const contribution = await campaign.methods.contribute();

			const options = {
				to: contribution._parent._address,
				data: contribution.encodeABI(),
				gas: '1000000',
				value: web3.utils.toWei(this.state.value, 'ether')
			};

			await signAndSendTransaction(options, privateKey);

			this.setState({ success: true });
		} catch (error) {
			this.setState({ error: error.message });
		}

		this.setState({ loading: false });
	};

	render() {

		const waitingMessage = this.state.loading ? <Message warning header="Notice!" content="Contribution might take 10 to 15 seconds. Please be patient." /> : '';
		const errorMessage = this.state.error ? <Message error header="Error!" content={this.state.error} /> : '';
		const successMessage = this.state.success ? <Message success header="Congrats!" content={`You just contributed ${this.state.value} ether to this campaign.`} /> : '';
		const privateKeyModal = this.state.privateKeyModal ? <PrivateKeyModal closeModal={this.closeModal} /> : '';

		return (
			<Layout>
				<Grid>
					<Grid.Row columns="2">
						<Grid.Column width="11">
							{this.renderCards()}
							<Link to={`/campaigns/${this.address}/requests`}>
								<Button primary style={{ marginTop: '15px' }}>Show Requests</Button>
							</Link>
						</Grid.Column>
						<Grid.Column width="5">
							{this.renderContributionForm()}
							{waitingMessage}
							{errorMessage}
							{successMessage}
							{privateKeyModal}
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Layout>
		);
	}
}
