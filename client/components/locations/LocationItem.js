import React from 'react';
import {Col, Panel} from 'react-bootstrap';
import {bootstrapUtils} from 'react-bootstrap/lib/utils'
import PropTypes from 'prop-types';

bootstrapUtils.addStyle(Panel, 'custom');

const LocationItem = ({loc, handleClick}) => (
  <Col sm={6} lg={3}>
    <Panel onClick={handleClick} className="panel-custom" header={loc.name}>{loc._id}</Panel>
  </Col>
)

LocationItem.propTypes = {
  loc: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    coordinates: PropTypes.array,
  }),
  handleClick: PropTypes.func
}

export default LocationItem;
