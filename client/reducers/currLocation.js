/**
 * Reducer for setting current location
 * 
 * @namespace currLocation
 * @memberof client.reducers
 */

import { SET_CURRENT_LOCATION, LOGOUT } from '../actions';

/**
 * @constant {Location}
 */
const initialState = null;

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
export function currLocation(state = initialState, action) {
	switch (action.type) {
		case SET_CURRENT_LOCATION:
			return action.location;
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
}
