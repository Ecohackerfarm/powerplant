import React from 'react';
import SetHeaderTitle from './shared/SetHeaderTitle';
import PropTypes from 'prop-types';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';

/**
 * A react component that says hello to the current user
 * @namespace Hello
 * @memberof client.components
 */
const Hello = ({ auth }) => {
	return (
		<Grid>
			<Row>
				<Col>
					<SetHeaderTitle>Home</SetHeaderTitle>
					<Jumbotron>
						<h1>
							{auth.isAuthenticated
								? 'Hello, ' + auth.currentUser.username
								: 'Not logged in'}
						</h1>
					</Jumbotron>
				</Col>
			</Row>
		</Grid>
	);
};

/**
 * @type {Object}
 * @memberof client.components.Hello
 * @prop {Object} auth - object in redux store containing all authentication information
 * @prop {Object} auth.user - current user information
 * @prop {String} auth.user.username - current user's username
 * @prop {String} auth.user.email - current user's email
 * @prop {Boolean} auth.isAuthenticated - quick check for if someone is currently logged in or not
 */
Hello.propTypes = {
	auth: PropTypes.object.isRequired
};

export default Hello;
