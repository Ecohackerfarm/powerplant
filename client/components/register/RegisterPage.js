/**
 * @namespace RegisterPage
 * @memberof client.components.register
 */

const React = require('react');
const { Redirect } = require('react-router-dom');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { Grid, Row, Col } = require('react-bootstrap');
const { userSignupRequest } = require('../../actions/userActions');
const SetHeaderTitle = require('../shared/SetHeaderTitle');
const RegisterForm = require('./RegisterForm');

/**
 * TODO: Refactor userSignupRequest, it's needed only in RegisterForm so it
 * shouldn't be here.
 * 
 * @extends Component
 */
class RegisterPage extends React.Component {
	/**
	 * @param {Object} props 
	 */
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
	};

	render() {
		const { userSignupRequest } = this.props;
		return (
			<Grid>
				<Row>
					<Col md={6} mdOffset={3}>
						{this.state.success && <Redirect to="/" />}
						<SetHeaderTitle>Sign up</SetHeaderTitle>
						<RegisterForm
							onSuccess={this.onSuccess}
							userSignupRequest={userSignupRequest}
						/>
					</Col>
				</Row>
			</Grid>
		);
	}
}

RegisterPage.propTypes = {
	userSignupRequest: PropTypes.func.isRequired
};

module.exports = connect(null, { userSignupRequest })(RegisterPage);
