import { Typeahead } from 'react-bootstrap-typeahead';
import style from 'react-bootstrap-typeahead/css/Typeahead.css';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * A react component that searches all crops with autocompletion feature
 * @namespace ChooseCrop
 * @memberof client.components
 */

class ChooseCrop extends React.Component {
	constructor(props) {
		super(props);

		// Autosuggest is a controlled component.
		// This means that you need to provide an input value
		// and an onChange handler that updates this value (see below).
		// Suggestions also need to be provided to the Autosuggest,
		// and they are initially empty because the Autosuggest is closed.
		this.state = {
			value: '',
			suggestions: []
		};
	}

	static propTypes = {
		cropNames: PropTypes.array.isRequired
	};

	theme = {
		container: 'autosuggest dropdown',
		containerOpen: 'dropdown open',
		input: 'form-control',
		suggestionsContainer: 'dropdown-menu',
		suggestion: '',
		suggestionFocused: 'active'
	};

	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		});
	};

	render() {

		return (
			<Typeahead
				clearButton
				multiple
				options={this.props.cropNames}
				placeholder="Choose a crop ..."
				onChange={this.onChange}
			/>
		);
	}
}

export default ChooseCrop;
