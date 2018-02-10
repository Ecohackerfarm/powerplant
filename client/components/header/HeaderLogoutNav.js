/**
 * @namespace HeaderLogoutNav
 * @memberof client.components.header
 */

const React = require('react');
const { NavItem, Nav } = require('react-bootstrap');
const PropTypes = require('prop-types');

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

module.exports = HeaderLogoutNav;
