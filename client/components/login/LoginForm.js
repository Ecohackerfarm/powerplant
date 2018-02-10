/**
 * @namespace LoginForm
 * @memberof client.components.login
 */

import React from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../shared/TextFieldGroup';
import validateLogin from '../../../shared/validation/loginValidation';
import { Button, FormGroup, HelpBlock } from 'react-bootstrap';

/**
 * @extends Component
 */
class LoginForm extends React.Component {
	static propTypes = {
		userLoginRequest: PropTypes.func.isRequired
	};

	state = {
		username: '',
		password: '',
		errors: {},
		isLoading: false
	};

	/**
	 * Since we reference the ID, we need to make the ID of each field
	 * the same as its corresponding state key.
	 * 
	 * @param {Object} event 
	 */
	onChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	/**
	 * @param {Object} event 
	 */
	onSubmit(event) {
		event.preventDefault();
		let { errors } = validateLogin(this.state);
		const isValid = !errors.username && !errors.password;
		if (isValid) {
			// calling our redux action to log in
			this.setState({ isLoading: true });
			this.props.userLoginRequest(this.state).catch((error) => {
				console.log('ERROR');
				console.log(error);
				const response = error.response;
				// if (typeof res !== 'undefined') {
				// if we get a response, use its errors
				errors =
					typeof response.data === 'undefined'
						? { form: 'Unable to log in' }
						: response.data.errors || {};
				// }
				this.setState({
					errors,
					isLoading: false
				});
			});
		} else {
			this.setState({ errors });
		}
	}

	render() {
		const { errors, isLoading } = this.state;
		return (
			<form onSubmit={this.onSubmit}>
				{errors.form && (
					<FormGroup validationState="error">
						<HelpBlock>{errors.form}</HelpBlock>
					</FormGroup>
				)}

				<TextFieldGroup
					value={this.state.username}
					onChange={this.onChange}
					id="username"
					error={errors.username}
					placeholder="Username"
				/>

				<TextFieldGroup
					value={this.state.password}
					onChange={this.onChange}
					id="password"
					error={errors.password}
					placeholder="Password"
					type="password"
				/>

				<Button
					bsStyle="primary"
					disabled={isLoading}
					type={!isLoading ? 'submit' : null}
				>
					Login
				</Button>
			</form>
		);
	}
}

export default LoginForm;
