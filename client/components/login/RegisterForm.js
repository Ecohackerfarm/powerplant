import React from 'react';
import PropTypes from 'prop-types';
import {post} from 'utils';

export default class RegisterForm extends React.Component {
  state = {
    username: '',
    email: '',
    password: ''
  };

  static propTypes = {
    userSignupRequest: PropTypes.func.isRequired
  }

  onChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    this.props.userSignupRequest(this.state);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h2>Join the powerplant community!</h2>
        <input onChange={this.onChange} value={this.state.username}
          name="username" placeholder="Username" type="text"/>
        <input onChange={this.onChange} value={this.state.email}
          name="email" placeholder="Email" type="text"/>
        <input onChange={this.onChange} value={this.state.password}
          name="password" placeholder="Password" type="password"/>
        <button>Register</button>
      </form>
    )
  }
}
