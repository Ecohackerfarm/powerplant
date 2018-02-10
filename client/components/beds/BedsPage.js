/**
 * @namespace BedsPage
 * @memberof client.components.beds
 */

 import React from 'react';
import { connect } from 'react-redux';
import CrudableList from '../shared/CrudableList';
import AddBedForm from './AddBedForm';
import BedItem from './BedItem';
import BedPage from './BedPage';
import { Grid } from 'react-bootstrap';
import { createBed } from '../../actions/bedActions';
import { deleteBed, editBed } from '../../actions';

/**
 * @extends Component
 */
class BedsPage extends React.Component {
	render() {
		let actionsWithLocationId = {};
		for (let key in this.props.actions) {
			actionsWithLocationId[key] = this.props.actions[key].bind(this, this.props.locationId);
		}
		return (
			<div className="yourBeds">
				<h3>Your Beds</h3>
				<Grid>
					<CrudableList
						actions={actionsWithLocationId}
						items={this.props.beds}
						itemName="bed"
						ItemListView={BedItem}
						AddItemForm={AddBedForm}
						DetailPage={BedPage}
						match={this.props.match}
					/>
				</Grid>
			</div>
		);
	}
}

const dispatchToProps = (dispatch) => ({
	actions: {
		create: (locationId, bed) => dispatch(createBed(locationId, bed)),
		edit: (locationId, id, changes) => dispatch(editBed(locationId, id, changes)),
		delete: (locationId, id) => dispatch(deleteBed(locationId, id))
	}
});

export default connect(null, dispatchToProps)(BedsPage);
