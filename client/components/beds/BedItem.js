import React from 'react';
import { Col, Panel } from 'react-bootstrap';

export default function({item, header}) {
	return (
		<Col sm={12} md={6} lg={3}>
			<Panel className="panel-custom" header={header}>
				{Object.entries(item.crops).map(([key, crop]) => {
					return <li key={key}>{crop.commonName}</li>
				})}
			</Panel>
		</Col>
	)
}
