import React from 'react';
import Header from './header/Header';
import Main from './Main';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class App extends React.Component {
	render() {
		if (!this.props.storeIsLoaded) {
			return (<div>Loading...</div>);
		} else {
			return (
					<div>
						<Header auth={this.props.auth} />
						<Main store={this.props.store} auth={this.props.auth} />
					</div>
			);
	  }
	}
}

App.propTypes = {
	storeIsLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = ({ app }) => {
	return { storeIsLoaded : app.storeIsLoaded };
};

export default withRouter(connect(mapStateToProps)(App));

