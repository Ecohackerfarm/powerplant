/**
 * @namespace AddBedForm
 * @memberof client.components.beds
 */

import React from 'react';
import AddBedsForm from './AddBedsForm';
import EditBedForm from './EditBedForm';
import { withRouter } from 'react-router-dom';

/**
 * @extends Component
 */
class AddBedForm extends React.Component {
	render() {
		if (typeof this.props.itemToEdit === 'undefined') {
			return <AddBedsForm {...this.props}/>;
		} else {
			return <EditBedForm {...this.props}/>;
		}
	}
}

export default withRouter(AddBedForm);
