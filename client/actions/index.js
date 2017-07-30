/**
 * Contains all possible redux actions
 * Each one must be dispatch()'ed to function properly, they can't just be called like any other function
 * Pure actions go here, non-pure actions (which execute code before dispatching an action) go in the relevant <type>Actions.js
 * @namespace actions
 * @memberof client
 */

import * as types from './types';

 /**
  * Response when an action is requested which involves adding new data
  * @typedef {Object} responseObject
  * @memberof client.actions
  * @property {Boolean} success was the action request successful?
  */

  //==================================
  //======BEGIN TITLE ACTIONS=========
  //==================================

  /**
   * Returns an action to make a title change
   * @param {String} title the new title which will be displayed
   * @return {client.actions.setTitleAction}
   */
  export function setTitle(title) {
    const action = {
      type: types.SET_TITLE,
      title: title
    }
    return action;
  }


  /**
   * Pure action to set the title
   * @typedef {Object} setTitleAction
   * @memberof client.actions
   * @property {String} [type={@link client.actions.types.SET_TITLE SET_TITLE}]
   * @property {String} title new title to be displayed
   */


  //==================================
  //====BEGIN LOCATION ACTIONS========
  //==================================

  /**
   * Build an {@link client.actions.addLocationAction addLocationAction}
   * @function
   * @param {server.models.Location} location location to be added
   * @return {client.actions.addLocationAction}
   */
  export const addLocation = (location) => {
    return {
      type: types.ADD_LOCATION,
      location
    }
  }

  /**
   * Build an {@link client.actions.editLocationAction editLocationAction}
   * @function
   * @param  {ObjectId|String} id id of location being modified
   * @param  {server.models.Location} location  location changes to be made
   * @return {client.actions.editLocationAction}        [description]
   */
  export const editLocation = (id, location) => ({
    type: types.EDIT_LOCATION,
    id,
    location
  });

  /**
   * Build an {@link client.actions.deleteLocationAction deleteLocationAction}
   * @function
   * @param  {ObjectId|String} id id of location being deleted
   * @return {client.actions.deleteLocationAction}        [description]
   */
  export const deleteLocation = (id) => ({
    type: types.DELETE_LOCATION,
    id
  });

  /**
   * Build a {@link client.actions.setLocationsAction setLocationsAction}
   * @function
   * @param {server.models.Location[]} locations
   * @return {client.actions.setLocationsAction}
   */
  export const setLocations = (locations) => {
    return {
      type: types.SET_LOCATIONS,
      locations
    }
  }



  /**
   * Pure action to add a single location
   * @typedef {Object} addLocationAction
   * @memberof client.actions
   * @property {String} [type={@link client.actions.types.ADD_LOCATION ADD_LOCATION}]
   * @property {server.models.Location} location location to be added
   */

  /**
  * Pure action to set all locations in the redux store
  * Will remove all current locations and replace them will the specified array
  * @typedef {Object} setLocationsAction
  * @memberof client.actions
  * @property {String} [type={@link client.actions.types.SET_LOCATIONS SET_LOCATIONS}]
  * @property {server.models.Location[]} locations locations to replace the current locations in the store
  */

  /**
   * Pure action to edit a location
   * @typedef {Object} editLocationAction
   * @memberof client.actions
   * @property {String} [type={@link client.actions.types.EDIT_LOCATION EDIT_LOCATION}]
   * @property {server.models.Location} before the location to be replaced
   * @property {server.models.Location} after the new location
   */

//==================================
//======BEGIN USER ACTIONS==========
//==================================


  /**
   * Build an action to logout the current user
   * @function
   * @return {client.actions.logoutUserAction}
   */
  export function logoutUser() {
    return {
      type: types.LOGOUT
    }
  }

  /**
   * Build an action to set the current authenticated user
   * @function
   * @param {server.models.User} user
   * @return {client.actions.setCurrentUserAction}
   */
  export function setCurrentUser(user) {
    return {
      type: types.SET_CURRENT_USER,
      user
    }
  }

  /**
   * Pure action to logout a user
   * @typedef {Object} logoutUserAction
   * @memberof client.actions
   * @property {String} [type={@link client.actions.types.LOGOUT LOGOUT}]
   */

   /**
    * Pure action to set the current user
    * @typedef {Object} setCurrentUserAction
    * @memberof client.actions
    * @property {String} [type={@link client.actions.types.SET_CURRENT_USER SET_CURRENT_USER}]
    * @property {server.models.User} user the user object. should not contain password
    */
