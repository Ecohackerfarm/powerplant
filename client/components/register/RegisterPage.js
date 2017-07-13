import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Col} from 'react-bootstrap';
import {userSignupRequest} from '/client/actions/userActions';
import HeaderTitle from '../shared/HeaderTitle';

import RegisterForm from './RegisterForm';

class Register extends React.Component {
  static propTypes = {
    userSignupRequest: PropTypes.func.isRequired
  }

  state = {
    success: false
  }

  onSuccess = () => {
    this.setState({
      success: true
    });
  }

  render() {
    const {userSignupRequest} = this.props;
    return (
      <Col md={6} mdOffset={3}>
        {this.state.success && <Redirect to="/" />}
        <HeaderTitle>Sign up</HeaderTitle>
        <RegisterForm onSuccess={this.onSuccess} userSignupRequest={userSignupRequest} />
      </Col>
      )
  }
}

export default connect(null, {userSignupRequest})(Register)
