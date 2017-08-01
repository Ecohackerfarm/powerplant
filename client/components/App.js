import React from 'react';
import Header from './header/Header';
import Main from './Main';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class App extends React.Component {
	static propTypes = {
		auth: PropTypes.object.isRequired
	};

	render() {
		return (
			<div>
				<Header auth={this.props.auth} />
				<Main auth={this.props.auth} />
			</div>
		);
	}
}

const stateToProps = ({ auth }) => ({ auth });

export default withRouter(connect(stateToProps)(App));
