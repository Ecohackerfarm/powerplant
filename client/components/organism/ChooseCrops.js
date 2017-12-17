import { Typeahead } from 'react-bootstrap-typeahead';
import style from 'react-bootstrap-typeahead/css/Typeahead.css';
import React from 'react';
import PropTypes from 'prop-types';
import { getCropNames } from '../actions/cropActions'
import { connect } from 'react-redux';

/**
 * A react component that searches all organisms with autocompletion feature
 * @namespace ChooseCrops
 * @memberof client.components
 */

class ChooseCrops extends React.Component {
	constructor(props) {
		super(props);

		// Autosuggest is a controlled component.
		// This means that you need to provide an input value
		// and an onChange handler that updates this value (see below).
		// Suggestions also need to be provided to the Autosuggest,
		// and they are initially empty because the Autosuggest is closed.
		this.state = {
			loading: false,
			error: false,
		};
	}

	static propTypes = {
		crop: PropTypes.array.isRequired
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
		if (this.props.loading){
			return <p>Loading ... </p>;
		}
		if (this.props.error) {
			return <p>Couldnt load</p>;
		}
		return (
			<Typeahead
				clearButton
				multiple
				options={this.props.cropNames}
				placeholder="Choose a Organism/Plant ..."
				onChange={this.onChange}
			/>
		);
	}
}
ChooseCrops.propTypes = {
	getCropNames : PropTypes.func.isRequired,
	cropNames : PropTypes.array.isRequired,
	loading : PropTypes.bool.isRequired,
	error : PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCropNames: () => dispatch(getCropNames())
    };
};

const mapStateToProps = (state) => {
    return {
    	  cropNames: state.cropNames,
        loading: state.cropsLoading,
        error: state.cropsError,
    };
};

export default connect (mapStateToProps, mapDispatchToProps)( ChooseCrops );


