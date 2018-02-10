/**
 * @namespace ChooseCrops
 * @memberof client.components.crops
 */

import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React from 'react';
import PropTypes from 'prop-types';
import {
	fetchCrops,
	fetchCombinations
} from '../../actions/cropActions';
import { connect } from 'react-redux';

/**
 * A react component that searches all organisms with autocompletion feature.
 * 
 * @extends Component
 */
class ChooseCrops extends React.Component {
	componentWillMount() {
		this.props.fetchCrops();
	}

	render() {
		if (this.props.error) {
			return <p>Couldn't load</p>;
		}
		return (
			<Typeahead
				clearButton
				multiple
				options={this.props.crops.all}
				labelKey='commonName'
				placeholder='Choose a crop ...'
				onChange={this.props.onChange}
				isLoading={this.props.loading}
			/>
		);
	}
}

ChooseCrops.propTypes = {
	onChange : PropTypes.func.isRequired,
	crops : PropTypes.object.isRequired,
	loading : PropTypes.bool.isRequired,
	error : PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
	fetchCrops: () => dispatch(fetchCrops()),
	fetchCombinations: () => dispatch(fetchCombinations())
});

const mapStateToProps = (state) => ({
	crops: state.crops,
	loading: state.crops.loading,
	error: state.crops.error,
});

export default connect (mapStateToProps, mapDispatchToProps)(ChooseCrops);
