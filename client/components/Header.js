import React from 'react';
import {Link} from 'react-router-dom';
import {Navbar, NavItem, NavDropdown, MenuItem, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import PropTypes from 'prop-types';

class Header extends React.Component {
  static propTypes = {
    title: PropTypes.string
  }

  static defaultProps = {
    title: 'powerplant v0.6'
  }

  render() {
    const customToggleStyle = {float:"left", marginLeft:"15px"};
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Toggle style={customToggleStyle} />
          <Navbar.Brand>
              {this.props.title}
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
