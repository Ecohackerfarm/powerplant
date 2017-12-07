// note: this file is only here for documentation purposes
// it represents a component that is passed in to crudablelist as a parameter

/**
 * A react component which should render a form to add an item to the list. It takes in two callbacks: onSubmit, which sends out a request
 * to dispatch a redux action to add the item, and onSuccess, which should be called after the result of onSubmit is checked and found to be successful.
 * It also takes in an object representing the initial state of the form, which should be used to populate the form only once in the constructor
 * @namespace AddItemForm
 * @memberof client.components.shared.CrudableList.CrudableListPage
 */

/**
 * @name propTypes
 * @memberof client.components.shared.CrudableList.CrudableListPage.AddItemForm
 * @type {Object}
 * @prop {client.components.shared.CrudableList.CrudableListPage~createCallback|client.components.shared.CrudableList.CrudableListPage~editCallback} onSubmit onSubmit callback, which takes in the location as a parameter
 * @prop {Function} onSuccess onSuccess callback, takes no parameters, just notifies container that the form is done
 * @prop {Object} itemToEdit item data used to populate initial form state
 */
