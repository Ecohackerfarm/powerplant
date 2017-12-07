import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Nav } from 'react-bootstrap';

export default () => (
	<Nav pullRight>
		<LinkContainer exact to="/register">
			<NavItem eventKey={2}>Sign up</NavItem>
		</LinkContainer>
		<LinkContainer exact to="/login">
			<NavItem className="log in" eventKey={3}>
				Log in
			</NavItem>
		</LinkContainer>
	</Nav>
);
