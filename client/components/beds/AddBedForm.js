import React from 'react';
import AddBedsForm from './AddBedsForm';
import EditBedForm from './EditBedForm';
import { withRouter } from 'react-router-dom';

const AddBedForm = (props) => {
	if ( typeof props.itemToEdit === 'undefined' )
		return <AddBedsForm {...props}/>
	else
		return <EditBedForm {...props}/>
}

export default withRouter(AddBedForm);
