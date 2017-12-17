import React from 'react';
import { connect } from 'react-redux'
//import { setHeaderTitle } from './actions/appActions';
//import ChooseCrops from './organism/ChooseCrops';
import PropTypes from 'prop-types';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';
//import { getCropsByName } from '../actions/cropActions'


/**
 * Root Container forp components
 * @namespace RootContainer
 * @memberof client.components
 */
class RootContainer extends React.Component {
  componentDidMount(){
  	this.prop.setHeaderTitle('Home');
  }

	render() {
		return (
			<Grid>
				<Row>
					<Col>
						<Jumbotron>
						</Jumbotron>
					</Col>
				</Row>
			</Grid>
		);
	};
};



/**
 * @type {Object}
 * @memberof client.components.RootContainer
 * @prop {Object} auth - object in redux store containing all authentication information
 * @prop {Object} auth.user - current user information
 * @prop {String} auth.user.username - current user's username
 * @prop {String} auth.user.email - current user's email
 * @prop {Boolean} auth.isAuthenticated - quick check for if someone is currently logged in or not
 */
RootContainer.propTypes = {
	setHeaderTitle: PropTypes.func.isRequired
};

const mapDispatchToProp = ( {setHeaderTitle}) => {
	return { setHeaderTitle };
}

export default connect(mapDispatchToProp)(RootContainer);
