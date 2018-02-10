/**
 * @namespace LocationsPage
 * @memberof client.components.locations
 */

import React from 'react';
import { connect } from 'react-redux';
import CrudableListPage from '../shared/CrudableList';
import LocationItem from './LocationItem';
import {
	saveLocationRequest,
	editLocationRequest,
	deleteLocationRequest
} from '../../actions/locationActions';
import AddLocationForm from './AddLocationForm';
import LocationPage from '../locations/LocationPage';
import {withRouter} from 'react-router-dom';

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

export default withRouter(connect(stateToProps, dispatchToProps)(LocationsPage));
