/**
 * @namespace App
 * @memberof client.components
 */

const React = require('react');
const Header = require('./header/Header');
const Main = require('./Main');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { withRouter } = require('react-router-dom');

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

module.exports = withRouter(connect(mapStateToProps)(App));
