/**
 * Displays the list of beds
 * @namespace BedsPage
 * *memberof client.components.beds
 */

import React from 'react';
import { connect } from 'react-redux';
import CrudableList from '../shared/CrudableList';
import AddBedForm from './AddBedForm';
import BedItem from './BedItem';
import { createBed, deleteBed, editBed } from '/client/actions/bedActions';

const BedsPage = function({ beds, match, location, actions }) {
	return (
		<CrudableList
			actions={actions}
			items={beds}
			itemName="bed"
			ItemListView={BedItem}
			AddItemForm={AddBedForm}
			match={match}
		/>
	);
};

const dispatchToProps = (dispatch) => ({
	actions: {
		create: bed => dispatch(createBed),
		edit: (id, bedChanges) => dispatch(editBed),
		delete: id => dispatch(deleteBed)
	}
});

export default connect(null, dispatchToProps)(BedsPage);
