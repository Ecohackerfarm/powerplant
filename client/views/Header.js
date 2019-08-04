/**
 * @namespace Header
 * @memberof client.views
 */

const React = require('react');
const { LinkContainer } = require('react-router-bootstrap');
const { Navbar, Nav } = require('react-bootstrap');

module.exports = function Header() {
  return (
    <Navbar bg="light" collapseOnSelect="true" expand="lg">
      <Navbar.Brand>powerplant</Navbar.Brand>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/about">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/crops">
            <Nav.Link>Crops</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
