/**
 * @namespace CropGroups
 * @memberof client.components.crops
 */

const PropTypes = require('prop-types');
const React = require('react');
const CropGroup = require('./CropGroup');

/**
 * @extends Component
 */
class CropGroups extends React.Component {
	/**
	 * @param {Object} props 
	 */
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	/**
	 * @param {Object} key 
	 * @param {Array} group 
	 * @param {Boolean} checked 
	 */
	onChange(key, group, checked) {
		if (checked && (group.length !== 0)) {
			this.choosenGroups[key] = group;
		} else {
			delete this.choosenGroups[key];
		}
		this.props.onChange(this.choosenGroups);
	}

	render() {
		if (this.props.loading) {
			return <p>{this.props.loadingText}</p>;
		} else if (this.props.error) {
			return <p>{this.props.errorText}</p>;
		} else if (this.props.groups.length) {
			this.choosenGroups = this.props.groups;
			return (
				<div>
					{this.props.groups.map((group, index) => {
						return (
							<CropGroup
								key={index}
								index={index}
								cropGroup={group}
								onChange={this.onChange}
								disabled
							/>
						);
					})}
				</div>);
		} else {
			return <div>this.props.noGroupsText</div>;
		}
	};
}

CropGroups.propTypes = {
	groups: PropTypes.array.isRequired,
}

CropGroups.defaultProps = {
	loadingText: "Loading ...",
	errorText: "Sorry, an error occured.",
	noGroupsText: "No Groups Found."
}

module.exports = CropGroups;
