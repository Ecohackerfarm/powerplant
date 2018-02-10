/**
 * @namespace Header
 * @memberof client.components.header
 */

const React = require('react');
const { withRouter } = require('react-router-dom');
const { connect } = require('react-redux');
const { Navbar, NavItem, Nav } = require('react-bootstrap');
const { LinkContainer } = require('react-router-bootstrap');
const PropTypes = require('prop-types');
const HeaderBrand = require('./HeaderBrand');

/**
 * @extends Component
 */
class Header extends React.Component {
	render() {
		const customToggleStyle = { float: 'left', marginLeft: '15px' };
		return (
			<Navbar collapseOnSelect>
				<Navbar.Header>
					<Navbar.Toggle style={customToggleStyle} />
					<HeaderBrand title={this.props.title} />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullLeft>
						<LinkContainer exact to="/">
							<NavItem eventKey={1.0}>Home</NavItem>
						</LinkContainer>
						<LinkContainer exact to="/about">
							<NavItem eventKey={1.0}>About</NavItem>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

Header.propTypes = {
		title: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
	title: state.app.headerTitle
});

module.exports = withRouter(connect(mapStateToProps)(Header));
