/**
 * @namespace RegisterForm
 * @memberof client.components.register
 */

const React = require('react');
const PropTypes = require('prop-types');
const validateUser = require('../../../shared/validation/userValidation');
const { Button, FormGroup, HelpBlock } = require('react-bootstrap');
const TextFieldGroup = require('../shared/TextFieldGroup');
const { connect } = require('react-redux');

/**
 * RegisterForm is a stateful form used to register new users.
 * 
 * props.userSignupRequest: Must be a Redux action that submits a request to
 * create a new userSignupRequest.
 * props.onSuccess: 
 * 
 * TODO: Refactor userSignupRequest to be done with mapDispatchToProps
 * 
 * @extends Component
 */
class RegisterForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			email: '',
			password: '',
			errors: {},
			isLoading: false
		};
	}

	/**
	 * Handle user keyboard input passed back = require(TextFieldGroup components.
	 * 
	 * @param {Object} event
	 */
	onChange(event) {
		this.setStae({
			[event.target.id]: event.target.value
		});
	}

	/**
	 * @param {Object} event 
	 */
	onSubmit(event) {
		event.preventDefault();
		const { errors, isValid } = validateUser(this.state);
		if (isValid) {
			this.setState({
				isLoading: true
			});
			this.props
				.userSignupRequest(this.state, this.props.locations)
				.then(this.props.onSuccess)
				.catch((error) => {
					const response = error.response;
					const errors =
						typeof (response.data === 'undefined')
							? { form: 'Unable to sign up' }
							: response.data.errors;
					this.setState({
						errors,
						isLoading: false
					});
				});
		} else {
			this.setState({ errors });
		}
	};

	render() {
		const { errors, isLoading } = this.state;
		return (
			<form onSubmit={this.onSubmit}>
				<h2>Join the powerplant community!</h2>
				{errors.form && (
					<FormGroup validationState="error">
						<HelpBlock>{errors.form}</HelpBlock>
					</FormGroup>
				)}

				<TextFieldGroup
					id="username"
					onChange={this.onChange}
					placeholder="Username"
					error={errors.username}
					value={this.state.username}
				/>

				<TextFieldGroup
					id="email"
					onChange={this.onChange}
					placeholder="Email"
					error={errors.email}
					value={this.state.email}
				/>

				<TextFieldGroup
					id="password"
					onChange={this.onChange}
					placeholder="Password"
					error={errors.password}
					type="password"
					value={this.state.password}
				/>

				<Button
					bsStyle="primary"
					disabled={isLoading}
					type={!isLoading ? 'submit' : null}
				>
					Register
				</Button>
			</form>
		);
	}
}

RegisterForm.propTypes = {
	userSignupRequest: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	locations: state.locations
});

module.exports = connect(mapStateToProps)(RegisterForm);
