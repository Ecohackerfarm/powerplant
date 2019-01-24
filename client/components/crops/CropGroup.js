/**
 * @namespace CropGroup
 * @memberof client.components.crops
 */

const React = require('react');
const PropTypes = require('prop-types');
const { Typeahead } = require('react-bootstrap-typeahead');
const style = require('react-bootstrap-typeahead/css/Typeahead.css');
const { ToggleButton, ToggleButtonGroup, Row, Col} = require('react-bootstrap');

/**
 * @extends Component
 */
class CropGroup extends React.Component {
	/**
	 * @param {Object} props 
	 */
	constructor(props) {
		super(props);
		this.onChangeGroup = this.onChangeGroup.bind(this);
		this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
		this.group = props.cropGroup;
		this.state = {
			checked: [1]
		};
	}

	/**
	 * @param {Array} group 
	 */
	onChangeGroup(group) {
		if (group.length > 0) {
			this.group = group;
			let checkedNow;
			if (!this.state.checked) {
				this.setState({
					checked: true
				});
				checkedNow = true;
			} else {
				checkedNow = false;
			}
			this.props.onChange(
				this.props.index,
				this.group,
				checkedNow
			);
		} else {
			this.group = [];
			this.setState({
				checked: false
			});
			this.props.onChange(
				this.props.index,
				this.group,
				false//this.state.checked
			);
		}
	}

	/**
	 * @param {Array} checkArray 
	 */
	onChangeCheckbox(checkArray) {
		let checkedNow;
		if (checkArray.length > 0){
			checkedNow = true;
		} else {
			checkedNow = false;
		}
		this.setState({
			checked : checkedNow
		});
		this.props.onChange(
			this.props.index,
			this.group,
			checkedNow//this.state.checked
		);
	}

	render() {
		return (
			<Row className="button-checkbox-center">
				<Col xs={3} md={2} >
					<ToggleButtonGroup
						type="checkbox"
						defaultValue={this.state.checked}
						onChange={this.onChangeCheckbox}
					>
						<ToggleButton value={1}></ToggleButton>
					</ToggleButtonGroup>
				</Col>
				<Col xs={9} md={10}>
					<Typeahead
						clearButton
						multiple
						align='justify'
						options={this.props.cropGroup}
						defaultSelected={this.props.cropGroup}
						labelKey={crop => ((crop.commonName !== null) ? crop.commonName : crop.binomialName)}
						placeholder='Bed is empty, choose crop ...'
						onChange={this.onChangeGroup}
						disabled={this.props.disabled ? true : false}
					/>
				</Col>
			</Row>
		);
	}
}

CropGroup.propTypes = {
	cropGroup: PropTypes.array.isRequired,
}

module.exports = CropGroup;
