/**
 * @namespace App
 * @memberof client
 */

const React = require('react');
const { connect } = require('react-redux');
const { withRouter, Link, Switch, Route, Redirect } = require('react-router-dom');
const { LinkContainer } = require('react-router-bootstrap');
const { Container, Row, Col, Card, Navbar, Nav } = require('react-bootstrap');
const CropsPage = require('./CropsPage.js');
const AboutPage = require('./AboutPage.js');

/**
 *
 */
class App extends React.Component {
	render() {
		if (!this.props.storeLoaded) {
			return (<div>Loading...</div>);
		} else {
			return (
				<div>
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
					<div>
						<Switch>
							<Route path="/" exact={true} render={() => <Redirect to="/about" />} />
							<Route path="/crops" component={CropsPage} />
							<Route path="/about" component={AboutPage} />
						</Switch>
					</div>
				</div>
			);
		}
	}
}

const mapStateToProps = state => ({
	storeLoaded: state.app.storeLoaded
});

module.exports = withRouter(connect(mapStateToProps, null)(App));
