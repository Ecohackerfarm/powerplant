/**
 * @namespace LocationItem
 * @memberof client.components.locations
 */

const React = require('react');
const { Col, Card } = require('react-bootstrap');

/**
 * @extends Component
 */
class LocationItem extends React.Component {
	render() {
		return (
			<Col sm={6} lg={3}>
				<Card className="panel-custom">
					<Card.Body>
						{'address'}
					</Card.Body>
				</Card>
			</Col>
		)
	}
}

module.exports = LocationItem;
