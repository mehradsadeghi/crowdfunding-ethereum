import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import CampaignsList from './components/campaigns-list';
import CreateCampaign from './components/create-campaign';
import CampaignsDetails from './components/campaigns-details';
import CampaignsRequests from './components/campaigns-requests';
import CampaignsCreateRequest from './components/campaigns-create-request';

export default class App extends Component {

  render() {
    return (
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={CampaignsList} />
              <Route path="/campaigns/create" component={CreateCampaign} />
              <Route path="/campaigns/:address/requests/create" component={CampaignsCreateRequest} />
              <Route path="/campaigns/:address/requests" component={CampaignsRequests} />
              <Route path="/campaigns/:address" component={CampaignsDetails} />
            </Switch>
          </div>
        </Router>
    );
  }
}
