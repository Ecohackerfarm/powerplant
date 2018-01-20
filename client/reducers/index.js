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

import { combineReducers } from 'redux';
import { title } from './title';
import { auth } from './auth';
import { currLocation } from './currLocation';
import { locations } from './locations';
import { crops } from './crops';
import { app } from './app';

export default combineReducers({
    title,
    auth,
    currLocation,
    locations,
    crops,
    app
});
