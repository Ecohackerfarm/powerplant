/**
 * @namespace LoginPage
 * @memberof client.components.login
 */

const React = require('react');
const { connect } = require('react-redux');
const { Redirect } = require('react-router-dom');
const PropTypes = require('prop-types');
const LoginForm = require('./LoginForm');
const { Grid, Row, Col } = require('react-bootstrap');
const { userLoginRequest } = require('../../actions/userActions');
const SetHeaderTitle = require('../shared/SetHeaderTitle');

/**
 * @extends Component
 */
class Login extends React.Component {
	render() {
		const { userLoginRequest } = this.props;
		return (
			// in react-router v4 a Redirect is a page element
			// so we want to include a redirect element if we want to switch
			// back to the home screen
			<Grid>
				<Row>
					<Col md={6} mdOffset={3}>
						{this.props.success && <Redirect to="/" />}
						<SetHeaderTitle>Login</SetHeaderTitle>
						<LoginForm userLoginRequest={userLoginRequest} />
					</Col>
				</Row>
			</Grid>
		);
	}
}

Login.propTypes = {
	userLoginRequest: PropTypes.func.isRequired,
	success: PropTypes.bool.isRequired
};

const stateToProps = state => ({ success: state.auth.isAuthenticated });

module.exports = connect(stateToProps, { userLoginRequest })(Login);
