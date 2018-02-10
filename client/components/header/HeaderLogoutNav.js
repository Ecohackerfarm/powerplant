/**
 * @namespace HeaderLogoutNav
 * @memberof client.components.header
 */

import React from 'react';
import { NavItem, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * @extends Component
 */
class HeaderLogoutNav extends React.Component {
	render() {
		<Nav pullRight>
			<NavItem className="log out" eventKey={2} onSelect={this.props.userLogoutRequest}>
				Log out
		</NavItem>
		</Nav>
	}
}

HeaderLogoutNav.propTypes = {
	userLogoutRequest: PropTypes.func.isRequired
};

export default HeaderLogoutNav;
