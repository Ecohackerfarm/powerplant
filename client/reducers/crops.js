import {
	UPDATED_CROPS,
	LOADING_CROPS,
	UPDATE_CROPS_ERROR
} from '../actions/types';

export const defaultState = {
	all: [],
	loading: false,
	updated: 0,
	errorResponse: {},
	error: false
};

export const crops = (state = defaultState, action) => {
	switch (action.type) {
		case UPDATED_CROPS:
			return {
			  ...state,
			  all: action.all,
			  updated: action.updated,
			  error: false
			};
		case LOADING_CROPS:
		  return {
		  	...state,
		  	loading: action.loading
		  }
		case UPDATE_CROPS_ERROR:
		  return {
		  	...state,
		  	errorResponse: action.response,
		  	error: true
		  }
		default:
			return state;
	}
};
