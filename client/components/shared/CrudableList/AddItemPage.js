const React = require('react');
const { Redirect } = require('react-router-dom');
const { Container, Row, Col } = require('react-bootstrap');

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
				<Container>
					<Row>
						<Col md={6}>
							<AddItemForm
								onSuccess={this.onSuccess.bind(this)}
								onSubmit={this.props.onSubmit}
								itemToEdit={this.props.itemToEdit}
							/>
						</Col>
					</Row>
				</Container>
			);
		}
	}
}

module.exports = AddItemPage;
