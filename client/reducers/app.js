import {
	STORE_IS_LOADED,
	SET_HEADER_TITLE
} from '../actions';

const initialState = {
	storeIsLoaded: false,
	headerTitle: 'powerplant'
};

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
export function app(state = initialState, action) {
	switch (action.type) {
		case STORE_IS_LOADED:
			return {
				...state,
				storeIsLoaded: action.storeIsLoaded
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
