const React = require('react');
const PropTypes = require('prop-types');
const AddItemPage = require('./AddItemPage');

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
			itemToEdit={items[id]}
		/>
	);
};

EditItemPage.propTypes = {
	homeUrl: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	editAction: PropTypes.func.isRequired,
	itemName: PropTypes.string.isRequired,
	items: PropTypes.object.isRequired,
	EditItemForm: PropTypes.func.isRequired
};

module.exports = EditItemPage;
