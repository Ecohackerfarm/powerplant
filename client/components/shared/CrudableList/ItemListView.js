// note: this file is only here for documentation purposes
// it represents a component that is passed in to crudablelist as a parameter

/**
 * A react component which should render a single list item. For responsiveness, it should be inside of a Col, but for
 * adaptibility, this is left for you to implement within ItemListView, rather than automatically wrapper ItemListView in a Col.
 * The component takes in an item and a header as props. The item contains the data to display, and the header contains two functioning
 * right-justified buttons to edit and delete, as well as the name of the item. It is up to you how you choose to display this data.
 * @namespace ItemListView
 * @memberof client.components.shared.CrudableList.CrudableListPage
 */

/**
 * @name propTypes
 * @memberof client.components.shared.CrudableList.CrudableListPage.ItemListView
 * @type {Object}
 * @prop {Object} item data of the item which will be displayed.
 * @prop {Function} header a component which renders a header object. This contains a title, as well as two functioning buttons to edit and delete the item
 */
