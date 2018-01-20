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
		if (!this.props.storeIsLoaded) {
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
	storeIsLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = ({ app }) => ({
	storeIsLoaded: app.storeIsLoaded
});

export default withRouter(connect(mapStateToProps)(App));
