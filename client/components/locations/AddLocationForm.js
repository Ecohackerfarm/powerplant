/**
 * @namespace AddLocationForm
 * @memberof client.components.locations
 */

const React = require('react');
const validateLocation = require('../../../shared/validation/locationValidation');
const {
	Button,
	ButtonToolbar,
	FormGroup,
	HelpBlock,
	ListGroup,
	ListGroupItem
} = require('react-bootstrap');
const { LinkContainer } = require('react-router-bootstrap');
const TextFieldGroup = require('../shared/TextFieldGroup');

/**
 * @extends Component
 */
class AddLocationForm extends React.Component {
	/**
	 * @param {Object} props 
	 */
	constructor(props) {
		super(props);
		const { itemToEdit } = props;
		console.log(props);
		if (itemToEdit) {
			console.log('Setting to location ' + itemToEdit.name);
			this.state = {
				name: itemToEdit.name,
				loc: itemToEdit.loc,
				locationResults: [],
				errors: {},
				isLoading: false,
				selectedLocation: true
			};
		} else {
			console.log('Not editing anything');
			this.state = {
				name: '',
				loc: {
					address: '',
					coordinates: []
				},
				locationResults: [],
				errors: {},
				isLoading: false,
				selectedLocation: false
			};
		}

		this.typingTimer = {
			timer: undefined,
			timeout: 700
		};
	}

	/**
	 * Gets called when user types in a textbox.
	 * 
	 * @param {Object} event 
	 */
	onChange(event) {
		const { typingTimer, requestLocationResults } = this;
		let errors = Object.assign({}, this.state.errors, {
			[event.target.id]: undefined
		});
		let id = event.target.id;

		if (id === 'address') {
			clearTimeout(typingTimer.value);
			errors = Object.assign({}, errors, { address: undefined });
			if (event.target.value) {
				typingTimer.value = setTimeout(
					requestLocationResults,
					typingTimer.timeout
				);
			}
			this.setState({
				loc: {
					coordinates: [],
					address: event.target.value
				},
				selectedLocation: false,
				errors
			});
		} else {
			this.setState({
				[event.target.id]: event.target.value,
				errors
			});
		}
	}

	/**
	 * Gets called when the user types a query in the address textbox.
	 * Fetches possible locations = require(Google geocode API.
	 */
	requestLocationResults() {
		const address = this.state.loc.address;
		const headers = new Headers();
		const init = {
			method: 'GET',
			dataType: 'json',
			headers,
			credentials: 'omit'
		};
		fetch(
			'http://maps.google.com/maps/api/geocode/json?address='
			+ address
			, init)
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'ZERO_RESULTS') {
					this.setState({
						errors: Object.assign({}, this.state.errors, {
							address: 'Address not found'
						})
					});
				} else {
					let locationResults = data.results.map((location) => ({
						loc: {
							// yes, I know this is backwards
							// it's a mongodb thing :(
							address: location.formatted_address,
							coordinates: [
								location.geometry.location.lng,
								location.geometry.location.lat
							]
						}
					}));
					this.setState({
						locationResults,
						errors: Object.assign({}, this.state.errors, { address: undefined })
					});
				}
			})
			.catch(() => {
				this.setState({
					errors: Object.assign({}, this.state.errors, {
						address: 'Unable to fetch location results'
					})
				});
			});
	}

	/**
	 * Gets called when the user selects a location = require(the list.
	 * 
	 * @param {Number} index 
	 */
	setLocation(index) {
		let loc = this.state.locationResults[index].loc;
		let locationResults = [];
		const errors = Object.assign({}, this.state.errors, { address: undefined });
		this.setState({
			loc,
			locationResults,
			selectedLocation: true,
			errors
		});
	}

	/**
	 * @param {Object} event 
	 */
	onSubmit(event) {
		event.preventDefault();
		const location = {
			name: this.state.name,
			loc: this.state.loc,
			beds: {}
		};
		const { errors, isValid } = validateLocation(location);
		if (!isValid) {
			errors.address = (errors.loc || {}).coordinates;
			this.setState({
				errors
			});
		} else {
			this.props
				.onSubmit(location)
				.then(({ success }) => {
					if (success) {
						this.props.onSuccess();
					} else {
						console.log('Error saving');
					}
				})
				.catch((error) => {
					console.log(error);
					this.setState({
						errors: { form: 'Error saving location' }
					});
				});
		}
	}

	render() {
		const { errors, isLoading, locationResults } = this.state;
		return (
			<form onSubmit={this.onSubmit}>
				{this.state.errors.form && (
					<FormGroup validationState="error">
						<HelpBlock>{this.state.errors.form}</HelpBlock>
					</FormGroup>
				)}

				<TextFieldGroup
					id="name"
					onChange={this.onChange}
					placeholder="Name"
					error={errors.name}
					value={this.state.name}
				/>

				<TextFieldGroup
					id="address"
					onChange={this.onChange}
					placeholder="Address"
					error={errors.address}
					success={this.state.selectedLocation}
					value={this.state.loc.address}
				/>

				{locationResults.length > 0 && (
					<ListGroup>
						<ListGroupItem>Select your location</ListGroupItem>
						{locationResults.map(({ loc }, index) => (
							<ListGroupItem
								key={index}
								onClick={this.setLocation.bind(this, index)}
							>
								{loc.address}
							</ListGroupItem>
						))}
					</ListGroup>
				)}

				<ButtonToolbar>
					<LinkContainer to="/locations">
						<Button>Cancel</Button>
					</LinkContainer>

					<Button
						bsStyle="primary"
						disabled={isLoading}
						type={!isLoading ? 'submit' : null}
					>
						Submit
					</Button>
				</ButtonToolbar>
			</form>
		);
	}
}

module.exports = AddLocationForm;
