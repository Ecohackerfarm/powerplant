/**
 * Reducer for application actions
 * 
 * @namespace app
 * @memberof client.reducers
 */

import {
	STORE_LOADED,
	SET_HEADER_TITLE
} from '../actions';

/**
 * @constant {Object}
 * @property {Boolean} storeLoaded
 * @property {String} headerTitle
 */
const initialState = {
	storeLoaded: false,
	headerTitle: 'powerplant'
};

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
export function app(state = initialState, action) {
	switch (action.type) {
		case STORE_LOADED:
			return {
				...state,
				storeLoaded: action.storeLoaded
			};
		case SET_HEADER_TITLE:
	 		return {
				...state,
				headerTitle: action.title
	  		};
		default:
	  		return state;
  	}
}
