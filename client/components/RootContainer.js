import React from 'react';
import { connect } from 'react-redux'
//import ChooseCrops from './organism/ChooseCrops';
import PropTypes from 'prop-types';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';
import { setHeaderTitle } from '../actions/appActions'


/**
 * Root Container forp components
 * @namespace RootContainer
 * @memberof client.components
 */
class RootContainer extends React.Component {
  componentWillMount(){
  	this.props.setHeaderTitle('Home');
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

const mapDispatchToProp = (dispatch) => {
	return {
		setHeaderTitle : title => dispatch(setHeaderTitle(title))
	};
}

export default connect(undefined,mapDispatchToProp)(RootContainer);
