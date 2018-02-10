/**
 * Redux reducers. Each reducer manages its own part of the state.
 * 
 * @example
 * // Structure and initial state of the Redux store
 * const initialState = {
 *   title: 'powerplant',
 *   auth: {
 *     isAuthenticated: false,
 *     currentUser: null
 *   },
 *   currLocation: null,
 *   locations: [],
 * 	 beds: [],
 * 	 crops: [],
 *   cropInfos: [],
 *   cropRelationships: []
 * };
 * 
 * @namespace reducers
 * @memberof client
 */

const { combineReducers } = require('redux');
const { title } = require('./title');
const { auth } = require('./auth');
const { currLocation } = require('./currLocation');
const { locations } = require('./locations');
const { crops } = require('./crops');
const { app } = require('./app');

module.exports = combineReducers({
    title,
    auth,
    currLocation,
    locations,
    crops,
    app
});
