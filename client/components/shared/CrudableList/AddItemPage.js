import React from 'react';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import SetHeaderTitle from '/client/components/shared/SetHeaderTitle';

class AddItemPage extends React.Component {
  static propTypes = {
    saveItemRequest: PropTypes.func.isRequired,
    itemName: PropTypes.string.isRequired,
    AddItemForm: PropTypes.func.isRequired,
    homeUrl: PropTypes.string.isRequired,
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
      return <Redirect to={this.props.homeUrl} />
    }
    else {
      const AddItemForm = this.props.AddItemForm;
      return (
      <Grid>
        <Row>
          <Col md={6} mdOffset={3}>
            <AddItemForm onSuccess={this.onSuccess} saveItemRequest={this.props.saveItemRequest} />
          </Col>
        </Row>
      </Grid>
      )
    }
  }
}

export default AddItemPage;
