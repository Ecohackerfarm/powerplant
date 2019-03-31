const React = require('react');
const { Form } = require('react-bootstrap');
const { TAB, ENTER, ESCAPE } = require('./logic/input-field.js');

/**
 * @param {String}   props.value
 * @param {Function} props.handleChange
 * @param {Function} props.handleEnter
 * @param {Function} props.handleFocus
 */
class InputField extends React.Component {
  constructor(props) {
    super(props);

    this.onChange  = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  render() {
    const { value, handleChange, handleEnter, handleFocus } = this.props;

    return <Form.Control value={value} onChange={this.onChange} onKeyDown={this.onKeyDown} onFocus={() => handleFocus(true)} onBlur={() => handleFocus(false)} />;
  }

  onChange(event) {
    this.props.handleChange(event.target.value);
  }

  onKeyDown(event) {
    const key = event.keyCode;

    if (FORWARDED_KEYS.includes(key)) {
      this.props.handleFunctionKey(key);
      event.preventDefault();
    }
  }
}

const FORWARDED_KEYS = [
  TAB,
  ENTER,
  ESCAPE
];

module.exports = InputField;
