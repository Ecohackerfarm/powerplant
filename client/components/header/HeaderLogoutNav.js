import React from 'react';
import { NavItem, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';

const HeaderLogoutNav = ({ userLogoutRequest }) =>
	<Nav pullRight>
		<NavItem eventKey={2} onSelect={userLogoutRequest}>
			Log out
		</NavItem>
	</Nav>;

HeaderLogoutNav.propTypes = {
	userLogoutRequest: PropTypes.func.isRequired
};

export default HeaderLogoutNav;
