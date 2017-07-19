import React from 'react';
import {Grid, Row} from 'react-bootstrap';

const LocationList = (props) => (
  <Grid fluid>
    <Row>
      {props.children}
    </Row>
  </Grid>
)

export default LocationList;
