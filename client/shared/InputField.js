/**
 * @namespace InputField
 * @memberof client.shared
 */

const React = require('react');
const { Form } = require('react-bootstrap');
const { TAB, ENTER, ESCAPE } = require('./logic/input-field.js');

/**
 * Input field with enhanced event handling and programmatic control of the value. Can be used to
 * implement things like tab completion.
 *
 * @param {String}   props.value
 * @param {Function} props.handleChange
 * @param {Function} props.handleEnter
 * @param {Function} props.handleFocus
 */
class InputField extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  render() {
    const { value } = this.props;
    return (
      <Form.Control
        value={value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onFocus={() => this.onFocusChange(true)}
        onBlur={() => this.onFocusChange(false)}
      />
    );
  }

  onChange(event) {
    this.props.handleChange(event.target.value);
  }

  onKeyDown(event) {
    const { handleFunctionKey } = this.props;
    const key = event.keyCode;

    if (handleFunctionKey && FORWARDED_KEYS.includes(key)) {
      handleFunctionKey(key);
      event.preventDefault();
    }
  }

  onFocusChange(focus) {
    const { handleFocus } = this.props;

    if (handleFocus) {
      handleFocus(focus);
    }
  }
}

const FORWARDED_KEYS = [TAB, ENTER, ESCAPE];

module.exports = InputField;
