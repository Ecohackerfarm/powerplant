/**
 * @namespace App
 * @memberof client.components
 */

const React = require('react');
const { connect } = require('react-redux');
const { withRouter, Link, Switch, Route, Redirect } = require('react-router-dom');
const { LinkContainer } = require('react-router-bootstrap');
const { Container, Row, Col, Card, Navbar, Nav } = require('react-bootstrap');
const CropsPage = require('./CropsPage.js');
const AboutPage = require('./AboutPage.js');
const LocationsPage = require('./components/locations/LocationsPage.js');
const { addLocation } = require('./actions/index.js');

/**
 *
 */
class App extends React.Component {
	componentWillMount() {
		if (typeof this.props.locations[0] === 'undefined') {
			/*
			 * To make LocationsPage work.
			 */
			this.props.addLocation({
				'name': 'Minimal Viable Product',
				'loc': {
					'address': '1015 15th St NW #750, Washington, DC 20005, USA',
					'coordinates': [-77.0340315,38.9031004]
				},
				'beds': {}
			});
		}
	}

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
								<LinkContainer to="/locations/0/beds/add"><Nav.Link>Home</Nav.Link></LinkContainer>
								<LinkContainer to="/crops"><Nav.Link>Crops</Nav.Link></LinkContainer>
								<LinkContainer to="/about"><Nav.Link>About</Nav.Link></LinkContainer>
							</Nav>
						</Navbar.Collapse>
					</Navbar>
					<div>
						<Switch>
							<Route path="/" exact={true} render={() => <Redirect to="/locations/0/beds/add" />} />
							<Route path="/locations" component={LocationsPage} />
							<Route path="/crops" component={CropsPage} />
							<Route path="/about" component={AboutPage} />
						</Switch>
					</div>
				</div>
			);
		}
	}
}

const mapDispatchToProps = dispatch => ({
	addLocation: (location) => dispatch(addLocation(location))
});

const mapStateToProps = state => ({
	locations: state.locations,
	storeLoaded: state.app.storeLoaded
});

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
