/**
 * @namespace BedItem
 * @memberof client.components.beds
 */

const React = require('react');
const { Col, Card } = require('react-bootstrap');

/**
 * @extends Component
 */
class BedItem extends React.Component {
	render() {
		return (
			<Col>
				<Card>
					<Card.Header>{this.props.header}</Card.Header>
					<Card.Body>
					{Object.entries(this.props.item.crops).map(([key, crop]) => {
						return <li key={key}>{crop.commonName ? crop.commonName : crop.binomialName}</li>;
					})}
					</Card.Body>
				</Card>
			</Col>
		);
	}
}

module.exports = BedItem;
