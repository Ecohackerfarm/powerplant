/**
 * @namespace ChooseCrops
 * @memberof client.components.crops
 */

const { Typeahead } = require('react-bootstrap-typeahead');
require('react-bootstrap-typeahead/css/Typeahead.css');
const React = require('react');
const PropTypes = require('prop-types');
const {
	fetchCrops,
	fetchCombinations
} = require('../../actions/cropActions');
const { connect } = require('react-redux');

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
				labelKey={crop => ((crop.commonName !== null) ? crop.commonName : crop.binomialName)}
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

module.exports = connect (mapStateToProps, mapDispatchToProps)(ChooseCrops);
