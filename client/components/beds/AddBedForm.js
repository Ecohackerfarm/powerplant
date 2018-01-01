import React from 'react';
import ChooseCrops from '../crops/ChooseCrops';
import CropGroups from '../crops/CropGroups';
import { Jumbotron, Grid, Row, Col, Button } from 'react-bootstrap';
import Proptypes from 'prop-types';
import {connect } from 'react-redux';
import { createBed } from '../../actions/bedActions';

class AddBedForm extends React.Component {
	constructor(props){
		console.log('AddBedForm');
		super(props);
		this.onChangeValue = this.onChangeValue.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		//this.onSuccess;

		this.state = {
			choosenCrops : [],
			choosenBeds : []
		}
	}

	onSubmit(e){
		e.preventDefault();
		const {
			choosenBeds,
			createBed
		} = this.props;
		const locationKey = Number.parseInt(this.props.match.param.id,10);
		//TODO: VALIDATE PLANTS
		choosenBeds.forEach(bed => {
			createBed(locationKey, bed);
		});

	}

	onChangeValue(choosenCrops){
		this.setState({
			choosenCrops
		});
	}

	render(){
		return (
						<Jumbotron>
							<div className="choose-crops">
						  	<ChooseCrops onChangeValue={this.onChangeValue}/>
						  </div>
						  <CropGroups groups={this.state.choosenCrops}/>
						  <Col xs={3} mdOffset={2} md={2} >
								<Button onSubmit={this.onSubmit} type="submit" className="btn btn-primary">Submit</Button>
							</Col>
						</Jumbotron>
		);
	}
}

AddBedForm.proptypes = {
	createBed : Proptypes.func.required,
	items : Proptypes.object.required
}

const mapDispatchtoProp = (dispatch) => {
	return {
		createBed : dispatch(createBed())
	}
}

export default connect(null, mapDispatchtoProp)(AddBedForm);
