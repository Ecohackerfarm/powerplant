/**
 * @namespace HeaderLoginNav
 * @memberof client.components.header
 */

const React = require('react');
const { LinkContainer } = require('react-router-bootstrap');
const { NavItem, Nav } = require('react-bootstrap');

/**
 * @extends Component
 */
class HeaderLoginNav extends React.Component {
	render() {
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
	}
}

module.exports = HeaderLoginNav;
