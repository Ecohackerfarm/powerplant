import React from 'react';
import TextFieldGroup from '../shared/TextFieldGroup';
import validateLogin from '/shared/validation/loginValidation';
import {Button, FormGroup, HelpBlock} from 'react-bootstrap';

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
    if (isValid) {
      // calling our redux action to log in
      this.props.userLoginRequest(this.state)
      .then(this.props.onSuccess,
      (res) => {
        // if we get a response, use its errors
        const errors = typeof res.data === 'undefined' ?
          {form: "Unable to log in"} : res.data.errors;
        this.setState({errors});
      });
    }
    else {
      this.setState({
        errors: errors
      });
    }
  }

  render() {
    const errors = this.state.errors;
    return (
      <form onSubmit={this.onSubmit}>
      {errors.form &&
        <FormGroup validationState="error">
          <HelpBlock>{errors.form}</HelpBlock>
        </FormGroup>}

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
