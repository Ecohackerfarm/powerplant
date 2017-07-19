import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SetHeaderTitle from '../shared/SetHeaderTitle';
import LocationList from './LocationList';
import LocationItem from './LocationItem';

class LocationsPage extends React.Component {

  static propTypes = {
    locations: PropTypes.array.isRequired
  }

  render() {
    return (
      <div>
        <SetHeaderTitle>Locations</SetHeaderTitle>
        <LocationList>
          {this.props.locations.map(loc => <LocationItem key={loc._id} loc={loc} />)}
        </LocationList>
      </div>
    )
  }
}

const stateToProps = ({locations}) => ({locations});

export default connect(stateToProps)(LocationsPage);
