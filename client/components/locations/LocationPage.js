/**
 * @namespace LocationPage
 * @memberof client.components.locations
 */

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import BedsPage from '../beds';

/**
 * @extends Component
 */
class LocationPage extends React.Component {
	render() {
		return (
			<Switch>
				<Route exact path={`${this.props.match.path}`}>
					{/*Redirect for MVP later here should be a Dashboard*/}
					<Redirect to={`${this.props.match.url}/beds`} />
				</Route>
				<Route
					path={`${this.props.match.path}/beds`}
					render={(props) => (
						<BedsPage
							beds={this.props.items[this.props.id].beds}
							locationId={this.props.id}
							{...props}
						/>
					)}
				/>
			</Switch>
		);
	}
}

export default LocationPage;
