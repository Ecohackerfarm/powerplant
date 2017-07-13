import React from 'react';
import PropTypes from 'prop-types';
import {post} from 'utils';
import validateUser from 'shared/validation/userValidation'
import {Button, Row, Col} from 'react-bootstrap';
import TextFieldGroup from '../shared/TextFieldGroup';

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
      [evt.target.id]: evt.target.value
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    this.state.errors = {};
    const {errors, isValid} = validateUser(this.state);
    if (isValid) {
      this.props.userSignupRequest(this.state);
    }
    this.setState({errors: errors});
  }

  render() {
    const errors = this.state.errors;
    return (
      <Col md={8} mdOffset={2}>
        <form onSubmit={this.onSubmit}>
          <h2>Join the powerplant community!</h2>
          <TextFieldGroup
            id="username"
            onChange={this.onChange}
            placeholder="Username"
            error={errors.username}
            value={this.state.username}/>

          <TextFieldGroup
            id="email"
            onChange={this.onChange}
            placeholder="Email"
            error={errors.email}
            value={this.state.email}/>

          <TextFieldGroup
            id="password"
            onChange={this.onChange}
            placeholder="Password"
            error={errors.password}
            type="password"
            value={this.state.password}/>

          <Button type="submit">
            Register
          </Button>
        </form>
      </Col>
    )
  }
}
