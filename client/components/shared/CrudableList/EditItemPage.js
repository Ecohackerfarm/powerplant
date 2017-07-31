import React from 'react';
import PropTypes from 'prop-types';
import AddItemPage from './AddItemPage';

const EditItemPage = ({
	items,
	homeUrl,
	id,
	editAction,
	itemName,
	EditItemForm
}) => {
	return (
		<AddItemPage
			AddItemForm={EditItemForm}
			itemName={itemName}
			onSubmit={editAction.bind(this, id)}
			homeUrl={homeUrl}
			itemToEdit={items.find(item => item._id === id)}
		/>
	);
};

EditItemPage.propTypes = {
	homeUrl: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	editAction: PropTypes.func.isRequired,
	itemName: PropTypes.string.isRequired,
	items: PropTypes.array.isRequired,
	EditItemForm: PropTypes.func.isRequired
};

export default EditItemPage;
