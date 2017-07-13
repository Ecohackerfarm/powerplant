import React from 'react';
import TextFieldGroup from '../shared/TextFieldGroup';
import validateLogin from '/shared/validation/loginValidation';
import {Button} from 'react-bootstrap';

export default class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
    errors: {}
  }

  // since we reference the id, we need to make the id of each field
  // the same as its corresponding state key
  onChange = (evt) => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const {errors} = validateLogin(this.state);
    const isValid = !errors.username && !errors.password;
    this.setState({
      errors: errors
    });
    if (isValid) {
      // TODO: this is where we request a JSON web token from the server
      // (i think)
      this.props.userLoginRequest(this.state);
      this.props.onSuccess();
    }
  }

  render() {
    const errors = this.state.errors;
    return (
      <form onSubmit={this.onSubmit}>
        <TextFieldGroup
          value={this.state.username}
          onChange={this.onChange}
          id="username"
          error={errors.username}
          placeholder="Username" />

        <TextFieldGroup
          value={this.state.password}
          onChange={this.onChange}
          id="password"
          error={errors.password}
          placeholder="Password"
          type="password" />

        <Button type="submit">
          Login
        </Button>
      </form>
    )
  }
}
