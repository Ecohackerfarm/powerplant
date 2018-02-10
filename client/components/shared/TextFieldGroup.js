const React = require('react');
const {
	FormGroup,
	FormControl,
	ControlLabel,
	HelpBlock
} = require('react-bootstrap');
const PropTypes = require('prop-types');

/**
 * @extends Component
 */
class TextFieldGroup extends React.Component {
	render() {
		return (
			<FormGroup
				controlId={this.props.id}
				validationState={
					this.props.error ? 'error' : this.props.success ? 'success' : null
				}
			>
				{this.props.label && <ControlLabel>{this.props.label}</ControlLabel>}

				<FormControl
					type={this.props.type}
					value={this.props.value}
					placeholder={this.props.placeholder || this.props.id}
					onChange={this.props.onChange}
				/>

				<FormControl.Feedback />

				{this.props.error && <HelpBlock>{this.props.error}</HelpBlock>}
			</FormGroup>
		);
	}
}

TextFieldGroup.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	error: PropTypes.string,
	success: PropTypes.bool,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	type: PropTypes.string
};

TextFieldGroup.defaultProps = {
	type: 'text'
};

module.exports = TextFieldGroup;
