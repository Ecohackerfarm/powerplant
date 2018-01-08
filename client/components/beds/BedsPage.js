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
import BedPage from './BedPage';
import { Grid } from 'react-bootstrap';
import { createBed, deleteBed, editBed } from '/client/actions/bedActions';

const BedsPage = function({  beds, match, location, actions, locationId }) {
	let actionsWithLocationId = {};
  for (let key in actions){
  	actionsWithLocationId[key]= actions[key].bind(this,locationId);
  }
	return (
		<div className="yourBeds">
			<h3>Your Beds</h3>
			<Grid>
				<CrudableList
					actions={actionsWithLocationId}
					items={beds}
					itemName="bed"
					ItemListView={BedItem}
					AddItemForm={AddBedForm}
					DetailPage={BedPage}
					match={match}
				/>
			</Grid>
		</div>
	);
};

const dispatchToProps = (dispatch) => ({
	actions: {
		create: (locationId,bed) => dispatch(createBed(locationId, bed)),
		edit: (locationId, id, changes) => dispatch(editBed(locationId, id,changes)),
		delete: (locationId, id) => dispatch(deleteBed(locationId, id))
	}
});

export default connect(null, dispatchToProps)(BedsPage);
