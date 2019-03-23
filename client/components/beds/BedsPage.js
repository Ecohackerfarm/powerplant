/**
 * @namespace BedsPage
 * @memberof client.components.beds
 */

const React = require('react');
const { connect } = require('react-redux');
const CrudableList = require('../shared/CrudableList');
const AddBedForm = require('./AddBedForm');
const BedItem = require('./BedItem');
const BedPage = require('./BedPage');
const { Container } = require('react-bootstrap');
const { createBed } = require('../../actions/bedActions');
const { deleteBed, editBed } = require('../../actions');

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
				<Container>
					<CrudableList
						actions={actionsWithLocationId}
						items={this.props.beds}
						itemName="bed"
						ItemListView={BedItem}
						AddItemForm={AddBedForm}
						DetailPage={BedPage}
						match={this.props.match}
					/>
				</Container>
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

module.exports = connect(null, dispatchToProps)(BedsPage);
