import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Navbar, NavItem, NavDropdown, MenuItem, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import HeaderBrand from './HeaderBrand';

class Header extends React.Component {
  render() {

    const customToggleStyle = {float:"left", marginLeft:"15px"};
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Toggle style={customToggleStyle} />
          <HeaderBrand />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullLeft>
            <LinkContainer exact to="/">
              <NavItem eventKey={1}>Home</NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <LinkContainer exact to="/register">
              <NavItem eventKey={2}>Sign up</NavItem>
            </LinkContainer>
            <LinkContainer exact to="/login">
              <NavItem eventKey={3}>Log in</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;
