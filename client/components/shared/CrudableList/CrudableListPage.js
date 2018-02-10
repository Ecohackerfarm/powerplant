const React = require('react');
const { Switch, Route } = require('react-router-dom');
const { LinkContainer } = require('react-router-bootstrap');
const PropTypes = require('prop-types');
const { Grid, Button } = require('react-bootstrap');
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
					<Grid>
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
							<Button bsStyle="floating">+</Button>
						</LinkContainer>
					</Grid>
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

/**
 * @memberof client.components.shared.CrudableList.CrudableListPage
 * @prop {Object} actions      redux actions which the list will call - note that they must ALREADY be wrapped in dispatch calls
 * @prop {client.components.shared.CrudableList.CrudableListPage~createCallback} actions.create submit a request to save a new item
 * @prop {client.components.shared.CrudableList.CrudableListPage~editCallback} actions.edit submit a request to edit an existing item
 * @prop {client.components.shared.CrudableList.CrudableListPage~deleteCallback} actions.delete submit a request to delete an existing item
 * @prop {Object[]} items       the data to be displayed in the list
 * @prop {String} itemName     lowercase singular name of the type being displayed
 * @prop {client.components.shared.CrudableList.CrudableListPage.ItemListView} ItemListView A react component which displays a single list item
 * @prop {client.components.shared.CrudableList.CrudableListPage.AddItemForm} AddItemForm  A react component which renders a form for adding a new item
 * @prop {Object} match        react-router match parameter must be passed through
 */
CrudableListPage.propTypes = {
	actions: PropTypes.object.isRequired,
	items: PropTypes.object.isRequired,
	itemName: PropTypes.string.isRequired,
	ItemListView: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired
};

module.exports = CrudableListPage;
