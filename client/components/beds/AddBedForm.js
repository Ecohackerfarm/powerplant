import React from 'react';
import ChooseCrops from '../crops/ChooseCrops';
import CropGroups from '../crops/CropGroups';
import { Jumbotron, Grid, Row, Col, Button } from 'react-bootstrap';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { createBed } from '../../actions/bedActions';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class AddBedForm extends React.Component {
	constructor(props){
		super(props);
		this.onChangeChooseCrop = this.onChangeChooseCrop.bind(this);
		this.onChangeCropGroups = this.onChangeCropGroups.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.chosenBeds = [];
		//this.onSuccess;

		this.state = {
			chosenCrops : [],
			loadingGroups : false,
			groups : [],
			groupsError : false,
			savingError : false
		}
	}
	minNumberOfCrops = 3;

	getGroups(cropIds){
			this.setState({
				loadingGroups : true
			});
			axios.post(
				  '/api/get-crop-groups',
				  { cropIds }
			).then(res => {
					if (res.status === 200) {
						this.setState({
							groups : res.data
						});
					} else {
						this.setState({
							groupsError : res
						});
					}
					this.setState({
						loadingGroups : false
					});
					//return {res};
			});
	}

	onSubmit(e){
		e.preventDefault();
		//TODO: VALIDATE PLANTS
		let createPromises=[];
		this.chosenBeds.forEach(bed => {
			//create beds from
			createPromises.push(this.props.onSubmit( bed ));
		});
		Promise.all(createPromises).then(
			()=> this.props.onSuccess()
		).catch(err => {
			this.setState({
				savingError: { form : 'Error saving beds'}
			})
		});

	}

	onChangeChooseCrop(chosenCrops){
	  this.setState({
			chosenCrops
		});
		const cropIds = chosenCrops.map((crop)=>{
			return crop._id;
		})
		if( chosenCrops.length >= this.minNumberOfCrops ){
			this.getGroups(cropIds);
		}
	};

	onChangeCropGroups(chosenGroups){
		this.chosenBeds = chosenGroups;
	};

	render(){
		return (
						<form onSubmit={this.onSubmit}>
							<div className="choose-crops">
						  	<ChooseCrops onChange={this.onChangeChooseCrop}/>
						  </div>
						  <CropGroups
						  	error={this.state.groupsError}
						  	loading={this.state.loadingGroups}
						  	groups={this.state.groups}
						  	onChange={this.onChangeCropGroups}
						  />
							<div className="button-checkbox-center">
								<Button
									type="submit"
									className="btn btn-primary"
									>Submit</Button>
							</div>
						</form>
		);
	}
}

export default withRouter(AddBedForm);
