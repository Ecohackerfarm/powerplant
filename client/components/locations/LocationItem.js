import React from 'react';
import {Col, Panel} from 'react-bootstrap';
import PropTypes from 'prop-types';

const LocationItem = ({loc, handleClick}) => (
  <Col sm={6} lg={3}>
    <Panel onClick={handleClick} className="panel-custom" header={loc.name}>{loc.loc.coordinates}</Panel>
  </Col>
)

LocationItem.propTypes = {
  loc: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    loc: PropTypes.shape({
      coordinates: PropTypes.array,
    })
  }),
  handleClick: PropTypes.func
}

export default LocationItem;
