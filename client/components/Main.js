import React from 'react';
import { Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Login from './login/LoginPage';
import Register from './register/RegisterPage';
import Recover from './recover/Recover';
import LocationsPage from './locations/LocationsPage';
import AboutPage from './about/AboutPage'
import { saveLocationRequest } from '../actions/locationActions';
import { connect } from 'react-redux';

/**
 * Represents the main content area of the application, in contrast to
 * Header which is the main navigation component.
 * 
 * @extends Component
 */
class Main extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			waitForMVP : true
		};
	}

	componentWillMount() {
		// For MVP generate default location
		if (typeof this.props.locations[0] === 'undefined') {
			this.props.saveLocation({
				'name': 'Minimal Viable Product',
				'loc': {
					'address': '1015 15th St NW #750, Washington, DC 20005, USA',
					'coordinates': [-77.0340315,38.9031004]
				},
				'beds': {}
			}).then(() => {
				this.setState({ waitForMVP: false });
			});
		} else {
			this.setState({ waitForMVP: false });
		}
	}

	render() {
		if (this.state.waitForMVP) {
			return <p>Loading...</p>;
		} else
			return (
				<div>
					<Switch>
					  {/*For MVP Redirect to default location*/}
						<Route
							exact
							path="/"
							render={() => <Redirect path="/" to="/locations/0/beds/add"/>}
						/>
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/recover" component={Recover} />
						<Route path="/locations" component={LocationsPage} />
						<Route path="/about" component={AboutPage} />
					</Switch>
				</div>
			);
	}
}

const mapStateToProps = (state) => ({
	locations: state.locations
});

const mapDispatchToProps = (dispatch) => ({
	saveLocation: (location) => dispatch(saveLocationRequest(location))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
