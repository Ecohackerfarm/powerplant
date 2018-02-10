/**
 * @namespace LocationPage
 * @memberof client.components.locations
 */

const React = require('react');
const { Switch, Route, Redirect } = require('react-router-dom');
const BedsPage = require('../beds');

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

module.exports = LocationPage;
