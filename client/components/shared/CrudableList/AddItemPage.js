import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

/**
 * @namespace AddItemPage
 * @memberof client.components.shared.CrudableList
 */

class AddItemPage extends React.Component {
	static propTypes = {
		onSubmit: PropTypes.func.isRequired,
		itemName: PropTypes.string.isRequired,
		AddItemForm: PropTypes.func.isRequired,
		homeUrl: PropTypes.string.isRequired,
		itemToEdit: PropTypes.object
	};

	state = {
		success: false
	};

	onSuccess = () => {
		this.setState({
			success: true
		});
	};

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
								onSuccess={this.onSuccess}
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

export default AddItemPage;
