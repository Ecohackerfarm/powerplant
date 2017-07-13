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
            <LinkContainer to="/">
              <NavItem eventKey={1}>Home</NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <LinkContainer to="/register">
              <NavItem eventKey={1}>Sign up</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
              <NavItem eventKey={2}>Log in</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;
