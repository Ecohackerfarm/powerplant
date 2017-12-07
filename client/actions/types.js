/**
 * This file contains every action type that could be taken
 * that would modify the redux store
 * Many of these are not implemented yet, but were taken
 * from the software specs' function list (ticket #959)
 * Note that these are not action objects, simply string constants representing each of the action types.
 * For full action objects, go to the respective action file (e.g. {@link client.actions.locationActions.SET_LOCATIONS})
 * @namespace types
 * @memberof client.actions
 */

// Title actions
/** Set the title */
export const SET_TITLE = 'SET_TITLE';

// User (auth) actions
/** Set the current user */
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
/** Create a new user with the local data */
export const CREATE_USER = 'CREATE_USER';
/** Logout and clear all data */
export const LOGOUT = 'LOGOUT';

// Location actions
/** Set the current location the user is viewing */
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
/** Modify a location */
export const EDIT_LOCATION = 'EDIT_LOCATION';
/** Add a new location */
export const ADD_LOCATION = 'ADD_LOCATION';
/** Delete a location */
export const DELETE_LOCATION = 'DELETE_LOCATION';
/** Set the entire list of locations in the store */
export const SET_LOCATIONS = 'SET_LOCATIONS';

// Bed actions
/** Modify a bed */
export const EDIT_BED = 'EDIT_BED';
/** Add a bed to a location */
export const ADD_BED = 'ADD_BED';
/** Delete a bed */
export const DELETE_BED = 'DELETE_BED';
/** Change the filter on beds being displayed */
export const FILTER_BEDS = 'FILTER_BEDS';
/** Set the entire list of beds in the store */
export const SET_BEDS = 'SET_BEDS';

// Crop actions
/** Edit a crop */
export const EDIT_CROP = 'EDIT_CROP';
/** Add a crop to a bed */
export const ADD_CROP = 'ADD_CROP';
/** Delete a crop */
export const DELETE_CROP = 'DELETE_CROP';
/** Set all crops in a bed */
export const SET_CROPS = 'SET_CROPS';

// Task actions
/** Edit a task */
export const EDIT_TASK = 'EDIT_TASK';
/** Add a new task */
export const ADD_TASK = 'ADD_TASK';
/** Delete a task */
export const DELETE_TASK = 'DELETE_TASK';
/** Set all tasks in store */
export const SET_TASKS = 'SET_TASKS';
