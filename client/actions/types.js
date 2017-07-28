// This file contains every action that could be taken
// that would modify the redux store
// Many of these are not implemented yet, but were taken
// from the software specs' function list (ticket #959)

// Title actions
export const SET_TITLE = 'SET_TITLE';

// User (auth) actions
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const CREATE_USER = 'CREATE_USER';
export const LOGOUT = 'LOGOUT';

// Location actions
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
export const EDIT_LOCATION = 'EDIT_LOCATION';
export const ADD_LOCATION = 'ADD_LOCATION';
export const DELETE_LOCATION = 'DELETE_LOCATION';
export const SET_LOCATIONS = 'SET_LOCATIONS';

// Bed actions
export const EDIT_BED = 'EDIT_BED';
export const ADD_BED = 'ADD_BED';
export const DELETE_BED = 'DELETE_BED';
export const FILTER_BEDS = 'FILTER_BEDS';
export const SET_BEDS = 'SET_BEDS';

// Crop actions
export const EDIT_CROP = 'EDIT_CROP';
export const ADD_CROP = 'ADD_CROP';
export const DELETE_CROP = 'DELETE_CROP';
export const SET_CROPS = 'SET_CROPS';

// Task actions
export const EDIT_TASK = 'EDIT_TASK';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const SET_TASKS = 'SET_TASKS';
