import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {userSignupRequest} from '/client/actions/userActions';

import RegisterForm from './RegisterForm';

class Register extends React.Component {
  static propTypes = {
    userSignupRequest: PropTypes.func.isRequired
  }

  render() {
    const {userSignupRequest} = this.props;
    return <RegisterForm userSignupRequest={userSignupRequest} />
  }
}

export default connect(null, {userSignupRequest})(Register)
