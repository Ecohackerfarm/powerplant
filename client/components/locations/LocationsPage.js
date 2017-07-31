import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import SetHeaderTitle from '../shared/SetHeaderTitle';
import CrudableListPage from '../shared/CrudableList';
import LocationItem from './LocationItem';
import {
	saveLocationRequest,
	editLocationRequest,
	deleteLocationRequest
} from '/client/actions/locationActions';
import AddLocationForm from './AddLocationForm';

const LocationsPage = ({ actions, locations, match }) => {
	return (
		<CrudableListPage
			actions={actions}
			match={match}
			items={locations}
			itemName="location"
			ItemListView={LocationItem}
			AddItemForm={AddLocationForm}
		/>
	);
};

const stateToProps = ({ locations }) => ({ locations });

const dispatchToProps = dispatch => ({
	actions: {
		create: location => dispatch(saveLocationRequest(location)),
		edit: (id, newItem) => dispatch(editLocationRequest(id, newItem)),
		delete: id => dispatch(deleteLocationRequest(id))
	}
});

export default connect(stateToProps, dispatchToProps)(LocationsPage);
