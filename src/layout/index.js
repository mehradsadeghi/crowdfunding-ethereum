import React from 'react';
import {Container, Menu} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default (props) => {
    return (
        <Container> 
            <div style={{marginTop: '20px', marginBottom: '40px'}}>
                <Menu>
                    <Menu.Item>
                        <Link style={{color: '#000'}} to="/">Crowdfunding</Link>
                    </Menu.Item>
                </Menu>
            </div>
            {props.children}
        </Container>
    );
}
