import React from 'react';
import { Col, Button } from 'react-bootstrap';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { getCompatibleCrops } from '../../utils/apiCalls';
import { Typeahead } from 'react-bootstrap-typeahead';
import { withRouter } from 'react-router-dom';
import { fetchCrops } from '../../actions/cropActions';

class EditBedForm extends React.Component {
	constructor(props){
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		//this.onSuccess;

		this.state = {
			compatibleCrops : [],
			loading : false,
			cropsInBed : this.props.itemToEdit.crops,
			error : false,
		}
	}
	componentWillMount(){
		this.getPossibleCrops();
	}
	getPossibleCrops(){
		window.clearTimeout(this.callApi);
		this.callApi = window.setTimeout(()=>{
			if(this.state.cropsInBed.length > 0){
				this.setState({
					loading : true,
				});
				getCompatibleCrops(
					  {
					  	cropIds : this.state.cropsInBed.map((crop)=>{
					  		return crop._id;
					  	})
					  }
				).then(res => {
					this.setState({
						compatibleCrops : res.data,
						loading : false
					});
				}).catch(error => {
					this.setState({
						error,
						loading : false
					});
				});
			} else {
				this.props.fetchCrops();
			}
		}, 450)
	}

	onSubmit(e){
		e.preventDefault();
		//TODO: VALIDATE PLANTS
		this.props.onSubmit({
			crops : this.state.cropsInBed
		})
		this.props.onSuccess();
	}

	onChange(chosenCrops){
	  this.setState(
	  	{
				cropsInBed : chosenCrops
			},
			this.getPossibleCrops
		);
	};

	render(){
		return (
			<form onSubmit={this.onSubmit}>
				<div className="choose-crops">
			  	<Typeahead
			  	clearButton
			  	multiple
			  	options={
			  		this.state.cropsInBed.length>0
			  		?	[
			  			...this.state.cropsInBed,
			  			...this.state.compatibleCrops
			  			]
			  		: this.props.crops.all
			  	}
			  	labelKey='commonName'
			  	placeholder='Bed is empty ...'
			  	onChange={this.onChange}
			  	isLoading={
			  		this.state.loading ||
			  		this.props.allCropsLoading
			  	}
			  	disabled={
			  		this.state.loading ||
			  		this.props.allCropsLoading
			  	}
			  	defaultSelected={this.state.cropsInBed}
			  	selectHintOnEnter={true}
			  	autoFocus={true}
			  	emptyLabel="No compatible crops found."
			  	/>
			  </div>
			  <Col xs={3} mdOffset={2} md={2} >
					<Button
						type="submit"
						className="btn btn-primary"
					>Submit</Button>
				</Col>
			</form>
		);
	}
}

const mapStateToProps = (state) => {
    return {
    	  crops: state.crops,
        allCropsLoading: state.crops.loading,
        allCropsError: state.crops.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCrops: () => dispatch(fetchCrops())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditBedForm));
