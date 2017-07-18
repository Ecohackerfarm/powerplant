import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Navbar, NavItem, NavDropdown, MenuItem, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import HeaderBrand from './HeaderBrand';
import {userLogoutRequest} from '/client/actions/userActions';
import HeaderLoginNav from './HeaderLoginNav';
import HeaderLogoutNav from './HeaderLogoutNav';


class Header extends React.Component {

  static propTypes = {
    userLogoutRequest: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  }

  render() {
    const customToggleStyle = {float:"left", marginLeft:"15px"};
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Toggle style={customToggleStyle} />
          <HeaderBrand title={this.props.title} />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullLeft>
            <LinkContainer exact to="/">
              <NavItem eventKey={1}>Home</NavItem>
            </LinkContainer>
          </Nav>
          {this.props.auth.isAuthenticated?
            <HeaderLogoutNav userLogoutRequest={this.props.userLogoutRequest} />
            :
            <HeaderLoginNav />}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const stateToProps = ({title}) => ({title});

export default withRouter(connect(stateToProps, {userLogoutRequest})(Header));
