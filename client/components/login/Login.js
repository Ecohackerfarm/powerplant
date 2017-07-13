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
    const {userLoginRequest} = this.props;
    return (
      // in react-router v4 a Redirect is a page element
      // so we want to include a redirect element if we want to switch
      // back to the home screen
      <Col md={8} mdOffset={2}>
        {this.state.success && <Redirect to="/" />}
           <LoginForm
            onSuccess={this.onSuccess}
            userLoginRequest={userLoginRequest}/>
      </Col>
    )
  }
}

export default connect(null, {userLoginRequest})(Login);
