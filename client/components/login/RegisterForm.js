import React from 'react';
import PropTypes from 'prop-types';
import {post} from 'utils';
import validateUser from 'shared/validation/userValidation'

export default class RegisterForm extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    errors: {}
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
    this.state.errors = {};
    const {errors, isValid} = validateUser(this.state);
    if (isValid) {
      this.props.userSignupRequest(this.state);
    }
    else {
      this.setState({errors: errors});
    }
  }

  render() {
    const errors = this.state.errors;
    return (
      <form onSubmit={this.onSubmit}>
        <h2>Join the powerplant community!</h2>
        <input onChange={this.onChange} value={this.state.username}
          name="username" placeholder="Username" type="text"/>
        {errors.username && <span>{errors.username}</span>}

        <input onChange={this.onChange} value={this.state.email}
          name="email" placeholder="Email" type="text"/>
        {errors.email && <span>{errors.email}</span>}

        <input onChange={this.onChange} value={this.state.password}
          name="password" placeholder="Password" type="password"/>
        {errors.password && <span>{errors.password}</span>}

        <button>Register</button>
      </form>
    )
  }
}
