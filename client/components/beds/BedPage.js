/**
 * @namespace BedPage
 * @memberof client.components.beds
 */

import React from 'react';
import { Redirect } from 'react-router-dom';

/**
 * @extends Component
 */
class BedPage extends React.Component {
	render() {
		/* Redirect for MVP */
		return <Redirect to={`${this.props.match.url}/edit`} />;
	}
}

export default BedPage;
