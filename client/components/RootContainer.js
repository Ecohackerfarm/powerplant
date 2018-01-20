import React from 'react';
import { connect } from 'react-redux';
import AddBedForm from './beds/AddBedForm';
import PropTypes from 'prop-types';
import { setHeaderTitle } from '../actions'

  const testGroups =
  [
    [
	    {
	    	id: 0,
	    	commonName: 'goodPlant'
	    },
	    {
	    	id: 2,
	    	commonName: 'bestPlant'
	    },
	    {
	    	id: 1,
	    	commonName: 'betterPlant'
	    },
	    {
	    	id: 3,
	    	commonName: 'neutralPlant'
	    }
    ],
    [
			{
	    	id: 0,
	    	commonName: 'goodPlant'
	    },
	    {
	    	id: 2,
	    	commonName: 'bestPlant'
	    },
	    {
	    	id: 1,
	    	commonName: 'betterPlant'
	    },
	    {
	    	id: 3,
	    	commonName: 'neutralPlant'
	    }
    ],
    [
			{
	    	id: 0,
	    	commonName: 'goodPlant'
	    },
	    {
	    	id: 2,
	    	commonName: 'bestPlant'
	    },
	    {
	    	id: 1,
	    	commonName: 'betterPlant'
	    },
	    {
	    	id: 3,
	    	commonName: 'neutralPlant'
	    }
    ]
  ];


/**
 * Root Container forp components
 * @namespace RootContainer
 * @memberof client.components
 */
class RootContainer extends React.Component {
  componentWillMount(){
  	this.props.setHeaderTitle('power plant');
  }
	render() {
		return (
			<AddBedForm location={{beds: testGroups}}/>
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
