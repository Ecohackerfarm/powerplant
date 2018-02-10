/**
 * @namespace AddBedForm
 * @memberof client.components.beds
 */

const React = require('react');
const AddBedsForm = require('./AddBedsForm');
const EditBedForm = require('./EditBedForm');
const { withRouter } = require('react-router-dom');

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

module.exports = withRouter(AddBedForm);
