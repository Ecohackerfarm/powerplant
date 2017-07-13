import React from 'react';
import {Link} from 'react-router-dom';
import {Navbar, NavItem, NavDropdown, MenuItem, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class Header extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
        <Navbar.Toggle />
          <Navbar.Brand>
            <Link to="/">powerplant v0.6</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
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
