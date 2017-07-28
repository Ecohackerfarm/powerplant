import React from 'react';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import {saveLocationRequest} from '/client/actions/locationActions';
import SetHeaderTitle from '/client/components/shared/SetHeaderTitle';

import AddLocationForm from './AddLocationForm';

class AddLocationPage extends React.Component {
  static propTypes = {
    saveLocationRequest: PropTypes.func.isRequired
  }

  state = {
    success: false
  };

  onSuccess = () => {
    this.setState({
      success: true
    });
  }

  render() {
    if (this.state.success) {
      return <Redirect to="/locations" />
    }
    else {
      return (
      <Grid>
        <Row>
          <Col md={6} mdOffset={3}>
            <SetHeaderTitle>Add location</SetHeaderTitle>
            <AddLocationForm onSuccess={this.onSuccess} saveLocationRequest={this.props.saveLocationRequest} />
          </Col>
        </Row>
      </Grid>
      )
    }
  }
}

export default connect(null, {saveLocationRequest})(AddLocationPage);
