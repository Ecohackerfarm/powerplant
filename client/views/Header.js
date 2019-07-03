import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';

export default function Header (){
    return (
      <Navbar bg="light" collapseOnSelect="true" expand="lg">
        <Navbar.Brand>powerplant</Navbar.Brand>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/about"><Nav.Link>Home</Nav.Link></LinkContainer>
            <LinkContainer to="/crops"><Nav.Link>Crops</Nav.Link></LinkContainer>
            <LinkContainer to="/about"><Nav.Link>About</Nav.Link></LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
}
