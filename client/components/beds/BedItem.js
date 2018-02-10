/**
 * @namespace BedItem
 * @memberof client.components.beds
 */

const React = require('react');
const { Col, Panel } = require('react-bootstrap');

/**
 * @extends Component
 */
class BedItem extends React.Component {
	render() {
		return (
			<Col sm={12} md={6} lg={3}>
				<Panel className="panel-custom panel-crudablelist" header={this.props.header}>
					{Object.entries(this.props.item.crops).map(([key, crop]) => {
						return <li key={key}>{crop.commonName}</li>;
					})}
				</Panel>
			</Col>
		);
	}
}

module.exports = BedItem;
