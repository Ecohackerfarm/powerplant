import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import HeaderBrand from './HeaderBrand';

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
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
Header.propTypes = {
		userLogoutRequest: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired
}

const mapStateToProps = ({ app }) => ({
 title : app.headerTitle
});

export default withRouter(connect(mapStateToProps)(Header));
