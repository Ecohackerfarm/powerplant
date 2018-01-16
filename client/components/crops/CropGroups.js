import PropTypes from 'prop-types';
import React from 'react';
import CropGroup from './CropGroup'


class CropGroups extends React.Component {
	constructor(props){
		super(props);
		this.onChange = this.onChange.bind(this);
	}
	onChange(key,group,checked){
		if ( checked && group.length !== 0 ){
			this.choosenGroups[key]=group;
		} else {
			delete this.choosenGroups[key];
		}
		this.props.onChange(this.choosenGroups);
	}
	render(){
		if (this.props.loading){
			return <p>Loading ...</p>;
		} else if ( this.props.error ){
			return <p>Error occured</p>;
		} else if (this.props.groups.length) {
			this.choosenGroups = this.props.groups;
	 		return (
	 			<div>
		 			{this.props.groups.map((group,index) =>{
			  		return (
				  		<CropGroup
				  		key={index}
				  		index={index}
				  		cropGroup={group}
				  		onChange={this.onChange}
				  		/>
			  		);
		  		})}
	 			</div>);
	 } else {
	   return <div>No Groups Found.</div>;
	 }
	};
}
CropGroups.propTypes = {
	groups : PropTypes.array.isRequired,
}

export default CropGroups;
