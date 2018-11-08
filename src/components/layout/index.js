import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default (props) => {
    return (
        <Container>
            <div style={{ marginTop: '20px', marginBottom: '40px' }}>
                <Menu>
                    <NavLink style={{ color: '#000' }} to="/" exact activeClassName="selected-menu">
                        <Menu.Item>Crowdfunding</Menu.Item>
                    </NavLink>
                </Menu>
            </div>
            {props.children}
        </Container>
    );
}
