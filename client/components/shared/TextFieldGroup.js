import React from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class TextFieldGroup extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    error: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string
  }

  static defaultProps = {
    type: 'text',
  }

  render() {
    return (
      <FormGroup controlId={this.props.id}
        validationState={this.props.error ? 'error' : null}>

        {this.props.label && <ControlLabel>{this.props.label}</ControlLabel>}

        <FormControl
          type={this.props.type}
          value={this.props.value}
          placeholder={this.props.placeholder || this.props.id}
          onChange = {this.props.onChange}/>

        <FormControl.Feedback />

        {this.props.error && <HelpBlock>{this.props.error}</HelpBlock>}
      </FormGroup>
    )
  }
}
