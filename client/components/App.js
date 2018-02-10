/**
 * @namespace App
 * @memberof client.components
 */

import React from 'react';
import Header from './header/Header';
import Main from './Main';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/**
 * Represents the main page.
 * 
 * @extends Component
 */
class App extends React.Component {
	render() {
		if (!this.props.storeLoaded) {
			return (<div>Loading...</div>);
		} else {
			return (
				<div>
					<Header />
					<Main />
				</div>
			);
	  	}
	}
}

App.propTypes = {
	storeLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = ({ app }) => ({
	storeLoaded: app.storeLoaded
});

export default withRouter(connect(mapStateToProps)(App));
