const React = require('react');
const { Redirect } = require('react-router-dom');
const PropTypes = require('prop-types');
const { Grid, Row, Col } = require('react-bootstrap');

/**
 * @namespace AddItemPage
 * @memberof client.components.shared.CrudableList
 */

class AddItemPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			success: false
		};
	}

	onSuccess() {
		this.setState({
			success: true
		});
	}

	render() {
		if (this.state.success) {
			return <Redirect to={this.props.homeUrl} />;
		} else {
			const AddItemForm = this.props.AddItemForm;
			return (
				<Grid>
					<Row>
						<Col md={6} mdOffset={3}>
							<AddItemForm
								onSuccess={this.onSuccess.bind(this)}
								onSubmit={this.props.onSubmit}
								itemToEdit={this.props.itemToEdit}
							/>
						</Col>
					</Row>
				</Grid>
			);
		}
	}
}

AddItemPage.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	itemName: PropTypes.string.isRequired,
	AddItemForm: PropTypes.func.isRequired,
	homeUrl: PropTypes.string.isRequired,
	itemToEdit: PropTypes.object
};

module.exports = AddItemPage;
