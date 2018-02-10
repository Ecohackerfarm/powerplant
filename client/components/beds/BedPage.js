/**
 * @namespace BedPage
 * @memberof client.components.beds
 */

const React = require('react');
const { Redirect } = require('react-router-dom');

/**
 * @extends Component
 */
class BedPage extends React.Component {
	render() {
		/* Redirect for MVP */
		return <Redirect to={`${this.props.match.url}/edit`} />;
	}
}

module.exports = BedPage;
