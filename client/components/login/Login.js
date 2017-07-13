import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import {Col} from 'react-bootstrap';
import {userLoginRequest} from '/client/actions/userActions';

class Login extends React.Component {
  static propTypes = {
    userLoginRequest: PropTypes.func.isRequired
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
    return (
      <Col md={8} mdOffset={2}>
        <LoginForm onSuccess={this.onSuccess} userLoginRequest={userLoginRequest}/>
        {this.state.success && <Redirect to="/" />}
      </Col>
    )
  }
}

export default connect(null, {userLoginRequest})(Login);
