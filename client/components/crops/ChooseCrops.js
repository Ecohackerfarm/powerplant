import { Typeahead } from 'react-bootstrap-typeahead';
import style from 'react-bootstrap-typeahead/css/Typeahead.css';
import React from 'react';
import PropTypes from 'prop-types';
import { fetchCrops } from '../../actions/cropActions'
import { connect } from 'react-redux';

/**
 * A react component that searches all organisms with autocompletion feature
 * @namespace ChooseCrops
 * @memberof client.components
 */

class ChooseCrops extends React.Component {
	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		});
	};
	componentWillMount() {
		this.props.fetchCrops();
	}

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
				options={this.props.crops.all}
				labelKey='commonName'
				placeholder='Choose a crop ...'
				onChange={this.onChange}
				isLoading={this.props.loading}
			/>
		);
	}
}
ChooseCrops.propTypes = {
	fetchCrops : PropTypes.func.isRequired,
	crops : PropTypes.object.isRequired,
	loading : PropTypes.bool.isRequired,
	error : PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCrops: () => dispatch(fetchCrops())
    };
};

const mapStateToProps = (state) => {
    return {
    	  crops: state.crops,
        loading: state.crops.loading,
        error: state.crops.error,
    };
};

export default connect (mapStateToProps, mapDispatchToProps)( ChooseCrops );


