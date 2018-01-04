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
import { Grid } from 'react-bootstrap';
import { createBed, deleteBed, editBed } from '/client/actions/bedActions';
// const beds= {"0":{"name":"bedname", "plants":[{"commonName":"aaaaaasdfr"},{"commonName":"aaaaaasdfr22"},{"commonName":"aaaaaasdfr33"}]},"1":{"name":"bedname", "plants":[{"commonName":"aaaaaasdfr44"},{"commonName":"aaaaaasdfr55"},{"commonName":"aaaaaasdfr66"}]},"2":{"name":"bedname", "plants":[{"commonName":"aaaaaasdfr77"},{"commonName":"aaaaaasdfr88"},{"commonName":"aaaaaasdfr99"}]}}
const BedsPage = function({  beds, match, location, actions }) {
	return (
		<div className="yoursBeds">
			<h3> Your Beds</h3>
			<Grid>
				<CrudableList
					actions={actions}
					items={beds}
					itemName="bed"
					ItemListView={BedItem}
					AddItemForm={AddBedForm}
					match={match}
				/>
			</Grid>
		</div>
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
