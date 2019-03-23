/**
 * @namespace AddBedsForm
 * @memberof client.components.beds
 */

const React = require('react');
const ChooseCrops = require('../crops/ChooseCrops');
const CropGroups = require('../crops/CropGroups');
const { Button } = require('react-bootstrap');
const { withRouter } = require('react-router-dom');
const { connect } = require('react-redux');
const { workerManager } = require('../../globals.js');

/**
 * @extends Component
 */
class AddBedForm extends React.Component {
	/**
	 * @param {Object} props 
	 */
	constructor(props) {
		super(props);
		this.onChangeChooseCrop = this.onChangeChooseCrop.bind(this);
		this.onChangeCropGroups = this.onChangeCropGroups.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.chosenBeds = [];
		//this.onSuccess;

		this.state = {
			chosenCrops: [],
			loadingGroups: false,
			groups: [],
			groupsError: false,
			savingError: false,
		}
	}

	/**
	 * @param {Object[]} crops
	 */
	getGroups(crops) {
		this.setState({
			loadingGroups: true
		});
		workerManager.delegate('getCropGroups', this.props.crops.relationships, crops).then((response) => {
			this.setState({
				groups: response,
				loadingGroups: false
			});
		}).catch((error) => {
			this.setState({
				groups: [],
				groupsError: error,
				loadingGroups: false
			});
		});
	}

	/**
	 * @param {Object} event
	 */
	onSubmit(event) {
		event.preventDefault();
		//TODO: VALIDATE PLANTS
		let createPromises = [];
		this.chosenBeds.forEach((crops, index) => {
			let generatedName = '';
			crops.forEach((crop) => {
				const name = crop.commonName ? crop.commonName : crop.binomialName;
				generatedName += name.slice(0, 2);
			});
			//create beds from
			createPromises.push(this.props.onSubmit({
				name: generatedName,
				crops
			}));
		});
		Promise.all(createPromises).then(() => this.props.onSuccess())
		.catch((error) => {
			this.setState({
				savingError: { form: 'Error saving beds'}
			});
		});
	}

	/**
	 * @param {Crop[]} chosenCrops 
	 */
	onChangeChooseCrop(chosenCrops) {
		this.setState({ chosenCrops });
		if (chosenCrops.length >= this.props.minNumberOfCrops) {
			this.getGroups(chosenCrops);
		}
	}

	/**
	 * @param {Object} chosenGroups 
	 */
	onChangeCropGroups(chosenGroups) {
		this.chosenBeds = chosenGroups;
	}

	cropGroups() {
		if (this.state.chosenCrops.length < this.props.minNumberOfCrops) {
			return (<p>{this.props.minNumberOfCropsText}</p>);
		} else {
			return (
				<CropGroups
					error={this.state.groupsError}
					loading={this.state.loadingGroups}
					groups={this.state.groups}
		  			onChange={this.onChangeCropGroups}
					/>
			);
		}
	}

	render() {
		this.chosenBeds = this.state.groups;
		return (
			<form onSubmit={this.onSubmit}>
				<div>{this.props.explanation}</div>
				<div className="choose-crops">
					<ChooseCrops onChange={this.onChangeChooseCrop}/>
				</div>
				{this.cropGroups()}
				<div className="button-checkbox-center">
					<Button
						type="submit"
						className="btn btn-primary"
						disabled={this.state.groups.length === 0}
						>
						{this.props.submitButtonText}
					</Button>
				</div>
			</form>
		);
	}
}

AddBedForm.defaultProps = {
	minNumberOfCrops: 3,
	submitButtonText: "Submit",
	minNumberOfCropsText: "Please select at least 3 crops.",
	explanation: "Please choose the crops you want to add in your garden. We will suggest you which plants should go together into the same bed."
};

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
	crops: state.crops
});

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(AddBedForm));
