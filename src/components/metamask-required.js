import React from 'react';
import { Message } from 'semantic-ui-react';

export default () => {

    let content = '';

    if (typeof window.web3 === 'undefined') {
        content = <Message error header="Oops!" content="Metasmask extension is required in order to run this application." />;
    }

    return content;
};
