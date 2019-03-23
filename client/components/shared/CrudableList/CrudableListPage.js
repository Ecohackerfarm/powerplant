const React = require('react');
const { Switch, Route } = require('react-router-dom');
const LinkContainer = require('../../LinkContainer.js');
const { Container, Button } = require('react-bootstrap');
const ItemList = require('./ItemList');
const AddItemPage = require('./AddItemPage');
const EditItemPage = require('./EditItemPage');
const SetHeaderTitle = require('../SetHeaderTitle');

/**
 * @callback client.components.shared.CrudableList.CrudableListPage~createCallback
 * @param {Object} item the data of the item to be created
 */

/**
 * @callback client.components.shared.CrudableList.CrudableListPage~editCallback
 * @param {ObjectId|String} id the id of the item to be edited
 * @param {Object} changes the changes to be made to the item
 */

/**
 * @callback client.components.shared.CrudableList.CrudableListPage~deleteCallback
 * @param {ObjectId|String} id the id of the item to be deleted
 */

/**
 * React Component
 * Build a fully CRUDable list = require(a few template components and action functions
 * Typical usage is to have a redux-connected container component which builds the actions and passes all props in to the CrudableList
 * @namespace CrudableListPage
 * @memberof client.components.shared.CrudableList
 */
const CrudableListPage = ({
	actions,
	items,
	itemName,
	ItemListView,
	AddItemForm,
	match,
	DetailPage
}) => {
	const homeUrl = match.url;
	return (
		<Switch>
			<Route
				exact
				path={match.url}
				render={() => (
					<Container>
						<SetHeaderTitle
							title={itemName.charAt(0).toUpperCase() + itemName.slice(1) + 's'}
						/>
						<ItemList
							deleteAction={actions.delete}
							match={match}
							items={items}
							ItemView={ItemListView}
							itemName={itemName}
						/>
						<LinkContainer to={`${match.url}/add`}>
							<Button>+</Button>
						</LinkContainer>
					</Container>
				)}
			/>
			<Route
				exact
				path={`${match.url}/add`}
				render={() => (
					<div>
						<SetHeaderTitle title={`Add ${itemName}`} />
						<AddItemPage
							AddItemForm={AddItemForm}
							itemName={itemName}
							onSubmit={actions.create}
							homeUrl={match.url}
							items={items}
						/>
					</div>
				)}
			/>
			<Route
				exact
				path={`${match.url}/:id/edit`}
				render={({ match }) => (
					<div>
						<SetHeaderTitle title={`Edit ${itemName}`} />
						<EditItemPage
							EditItemForm={AddItemForm}
							editAction={actions.edit}
							itemName={itemName}
							id={match.params.id}
							homeUrl={homeUrl}
							items={items}
						/>
					</div>
				)}
			/>
			<Route
				path={`${match.url}/:id`}
				render={({ match }) => (
					<div>
						<SetHeaderTitle title={`${itemName}`} />
						<DetailPage
						  match={match}
						  id={match.params.id}
						  items={items}
						/>
					</div>
				)}
			/>
		</Switch>
	);
};

module.exports = CrudableListPage;
