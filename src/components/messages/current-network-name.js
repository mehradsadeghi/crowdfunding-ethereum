import React from 'react';
import { Message } from 'semantic-ui-react';

export default () => {

    return <Message warning header="Current Network" content="This smart contract is deployed on Rinkeby Test Network. So you have to set your metamask network to Rinkeby Test Network in order to interact with this contract." />;
};
