import {
	STORE_IS_LOADED,
	SET_HEADER_TITLE
} from '../actions/types';

const initialState = {
	storeIsLoaded : false,
	headerTitle : 'powerplant'
}

export const app = ( state = initialState, action) => {
	switch (action.type) {
		case STORE_IS_LOADED:
		  return {
		  	...state,
		  	storeIsLoaded : action.storeIsLoaded
		  }
		case SET_HEADER_TITLE:
		  return {
		  	...state,
		  	headerTitle : action.title
		  }
		default:
		  return state
	}
}
