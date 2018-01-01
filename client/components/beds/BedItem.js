import React from 'react';
import { Col, Panel } from 'react-bootstrap';

export default function({ item }) {
	return (
		<Col sm={12} md={6} lg={3}>
			<Panel >
				{item.plants.map( plant =>
					<li>{plant.commonName}</li>)}
			</Panel>
		</Col>
	);
};
