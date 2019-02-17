const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { Switch, Route, Link } = require('react-router-dom');
const { fetchCrops } = require('../../actions/cropActions');
const CropPage = require('./CropPage');

/**
 * Page that lists crops
 *
 * @extends Component
 */
class CropsPage extends React.Component {
	constructor(props) {
		super(props);
	}
	
	componentWillMount() {
		this.props.fetchCrops();
	}

	collectTags() {
		const tagNames = [];
		const tags = [];
		this.props.crops.all.forEach(crop => {
			if (crop.tags) {
				crop.tags.forEach(tag => {
					if (!tagNames.includes(tag.name)) {
						tagNames.push(tag.name);
						tags.push(tag);
					}
				});
			}
		});
		return tags;
	}

	renderCropsByTag(props) {
		const listItems = this.props.crops.all.filter(crop => (crop.tags.some(tag => (tag.name == props.match.params.tag)))).map(crop => (
			<li>
				{ crop.commonName ? (crop.binomialName + ' (' + crop.commonName + ')') : (crop.binomialName)}
			</li>
		));
		return (
			<ul>
				{ listItems }
			</ul>
		);
	}

	render() {
		if (this.props.loading) {
			return <p>Loading</p>;
		}
		
		const listItems = this.props.crops.all.map((crop, index) => (
			<li>
				<Link to = { this.props.match.url + '/' + index }>
					{ crop.commonName ? (crop.binomialName + ' (' + crop.commonName + ')') : (crop.binomialName)}
				</Link>
			</li>
		));
		const tags = this.collectTags().map(tag => (
			<Link to = { this.props.match.url + '/tags/' + tag.name }>
				<button>{ tag.name }</button>
			</Link>
		));
		
		return (
			<div>
				<Switch>
					<Route
						exact path = { this.props.match.url }
						render = {
							() => (
								<div>
									<div>
										{ tags }
									</div>
									<ul>
										{ listItems }
									</ul>
								</div>
							)
						}
						/>
					<Route
						path = { this.props.match.url + '/tags/:tag' }
						render = { this.renderCropsByTag.bind(this) }
						/>
					<Route
						path = { this.props.match.url + '/:index' }
						render = {
							(props) => (
								<CropPage
									crop = { this.props.crops.all[parseInt(props.match.params.index, 10)] }
									tags = { this.collectTags() }
									/>
							)
						}
						/>
				</Switch>
			</div>
		);
	}
};

CropsPage.propTypes = {
	crops : PropTypes.object.isRequired,
	loading : PropTypes.bool.isRequired,
	error : PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
	fetchCrops: () => dispatch(fetchCrops())
});

const mapStateToProps = (state) => ({
	crops: state.crops,
	loading: state.crops.loading,
	error: state.crops.error,
});

module.exports = connect (mapStateToProps, mapDispatchToProps)(CropsPage);
