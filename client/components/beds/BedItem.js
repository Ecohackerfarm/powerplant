/**
 * @namespace BedItem
 * @memberof client.components.beds
 */

 import React from 'react';
import { Col, Panel } from 'react-bootstrap';

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

export default BedItem;
