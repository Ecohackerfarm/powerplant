import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Grid, Row, Col, HelpBlock, Button} from 'react-bootstrap';
import SetHeaderTitle from '../shared/SetHeaderTitle';
import LocationList from './LocationList';
import LocationItem from './LocationItem';
import AddLocation from './addLocation/AddLocationPage';

const LocationsPage = ({locations, match}) => (
  <Grid>
    <SetHeaderTitle>Locations</SetHeaderTitle>
    <Switch>
      <Route path={`${match.url}/add`} component={AddLocation} />
      <Route exact path={match.url} render={() => (
        <div>
          <LocationList locations={locations} />
          <LinkContainer exact to={`${match.url}/add`}>
            <Button bsStyle="floating">+</Button>
          </LinkContainer>
        </div>
      )} />
    </Switch>
  </Grid>
)

LocationsPage.propTypes = {
  locations: PropTypes.array.isRequired
}

const stateToProps = ({locations}) => ({locations});

export default connect(stateToProps)(LocationsPage);
