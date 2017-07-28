import React from 'react';
import PropTypes from 'prop-types';
import {HelpBlock, Col, Row} from 'react-bootstrap';
import LocationItem from './LocationItem';

const LocationList = ({locations}) => (
  <Row>
    {locations.length > 0 ?
    locations.map(loc => <LocationItem key={loc._id} loc={loc} />)
    :
    <Col>
      <HelpBlock>No locations yet...</HelpBlock>
    </Col>
    }
  </Row>
)

LocationList.propTypes = {
  locations: PropTypes.array.isRequired
}

export default LocationList;
