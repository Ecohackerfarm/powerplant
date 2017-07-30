import React from 'react';
import {Col, Panel} from 'react-bootstrap';
import PropTypes from 'prop-types';

const LocationItem = ({item, handleClick}) => (
  <Col sm={6} lg={3}>
    <Panel onClick={handleClick} className="panel-custom" header={item.name}>{item.loc.address}</Panel>
  </Col>
)

LocationItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    loc: PropTypes.shape({
      coordinates: PropTypes.array,
    })
  }),
  handleClick: PropTypes.func
}

export default LocationItem;
