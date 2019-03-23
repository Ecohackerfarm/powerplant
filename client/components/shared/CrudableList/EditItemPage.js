const React = require('react');
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

module.exports = EditItemPage;
