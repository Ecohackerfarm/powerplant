import React from 'react';
import { Col, Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LocationItem = ({ item, header }) => (
	<Col sm={6} lg={3}>
		<Panel className="panel-custom" header={header}>
			{item.loc.address}
		</Panel>
	</Col>
);

LocationItem.propTypes = {
	item: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		loc: PropTypes.shape({
			coordinates: PropTypes.array
		})
	}),
	header: PropTypes.object.isRequired
};

export default LocationItem;
