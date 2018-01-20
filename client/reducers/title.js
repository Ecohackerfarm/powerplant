/**
 * Reducer for setting the title
 * 
 * @namespace title
 * @memberof client.reducers
 */

import { SET_TITLE } from '../actions';

/**
 * @constant {String}
 */
const initialState = 'powerplant';

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
export function title(state = initialState, action) {
	switch (action.type) {
		case SET_TITLE:
			return action.title;
		default:
			return state;
	}
};
