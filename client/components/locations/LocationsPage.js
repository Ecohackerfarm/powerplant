import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SetHeaderTitle from '../shared/SetHeaderTitle';
import LocationList from './LocationList';
import LocationItem from './LocationItem';
import {Grid, Row, Col, HelpBlock} from 'react-bootstrap';

const LocationsPage = ({locations}) => (
  <Grid>
    <Row>
      <Col>
        <SetHeaderTitle>Locations</SetHeaderTitle>
        {locations.length > 0 ?
          <LocationList>
            {locations.map(loc => <LocationItem key={loc._id} loc={loc} />)}
          </LocationList>
          :
          <HelpBlock>No locations yet...</HelpBlock>
        }
      </Col>
    </Row>
  </Grid>
)

LocationsPage.propTypes = {
  locations: PropTypes.array.isRequired
}

const stateToProps = ({locations}) => ({locations});

export default connect(stateToProps)(LocationsPage);
