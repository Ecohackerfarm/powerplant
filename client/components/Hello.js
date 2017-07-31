import React from 'react';
import SetHeaderTitle from './shared/SetHeaderTitle';
import PropTypes from 'prop-types';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';

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

Hello.propTypes = {
	auth: PropTypes.object.isRequired
};

export default Hello;
