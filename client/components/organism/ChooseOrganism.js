import {Typeahead} from 'react-bootstrap-typeahead';
import style from "react-bootstrap-typeahead/css/Typeahead.css"
import React from 'react';
import PropTypes from 'prop-types';

/**
 * A react component that searches all organisms with autocompletion feature
 * @namespace ChooseOrganism
 * @memberof client.components
 */

class ChooseOrganism extends React.Component{
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
		organismNames: PropTypes.array.isRequired
  };

  theme = {
  	container: 'autosuggest dropdown',
  	containerOpen: 'dropdown open',
  	input: 'form-control',
  	suggestionsContainer: 'dropdown-menu',
  	suggestion: '',
  	suggestionFocused: 'active'
	};

	static getSuggestionValue = suggestion => suggestion;

	static renderSuggestion = suggestion => (
		  <a href="#">{suggestion}</a>
		);

  getSuggestions = value => {
		const inputValue = value.trim().toLowerCase();
		const regexString = ".*" + inputValue + ".*";
		const regex = new RegExp(regexString,"g");

	  	return inputValue.length === 0
		  ? []
		  : this.props.organismNames.filter(name =>
		      regex.test(name.toLowerCase())
		);
	};

	onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };



  render () {
    const { suggestions } = this.state;

 		return (
      <Typeahead
	      clearButton
	      multiple
	      options={this.props.organismNames}
	      placeholder="Choose a Organism/Plant ..."
	    />
		);
 	}

};



export default ChooseOrganism;
