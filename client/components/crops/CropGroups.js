import PropTypes from 'prop-types';
import React from 'react';
import CropGroup from './CropGroup'


class CropGroups extends React.Component {
	render(){
		if (this.props.groups.length) {
	 		return (
	 			<div>
		 			{this.props.groups.map((group,index) =>{
			  		return (
				  		<CropGroup key={index} cropGroup={group}/>
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
