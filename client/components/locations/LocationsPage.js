/**
 * @namespace LocationsPage
 * @memberof client.components.locations
 */

const React = require('react');
const { connect } = require('react-redux');
const CrudableListPage = require('../shared/CrudableList');
const LocationItem = require('./LocationItem');
const {
	saveLocationRequest,
	editLocationRequest,
	deleteLocationRequest
} = require('../../actions/locationActions');
const AddLocationForm = require('./AddLocationForm');
const LocationPage = require('../locations/LocationPage');
const {withRouter} = require('react-router-dom');

/**
 * @extends Component
 */
class LocationsPage extends React.Component {
	render() {
		return (
			<CrudableListPage
				actions={this.props.actions}
				match={this.props.match}
				items={this.props.locations}
				itemName="location"
				ItemListView={LocationItem}
				AddItemForm={AddLocationForm}
				DetailPage={LocationPage}
			/>
		);
	}
}

const stateToProps = ({ locations }) => ({ locations });

const dispatchToProps = dispatch => ({
	actions: {
		create: (location) => dispatch(saveLocationRequest(location)),
		edit: (id, newItem) => dispatch(editLocationRequest(id, newItem)),
		delete: (id) => dispatch(deleteLocationRequest(id))
	}
});

module.exports = withRouter(connect(stateToProps, dispatchToProps)(LocationsPage));
