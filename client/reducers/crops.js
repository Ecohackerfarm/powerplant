import {
	UPDATED_CROPS,
	UPDATED_RELATIONSHIPS,
	UPDATE_CROPS_ERROR,
	LOADING_CROPS,
	LOADING_RELATIONSHIPS,
	UPDATED_RELATIONSHIPS_ERROR
} from '../actions/types';

export const defaultState = {
	all: [],
	loading: false,
	updated: 0,
	errorResponse: {},
	error: false,
	relationshipsLoading : false,
	relationshipsUpdated : 0,
	relationships : []
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
		case UPDATED_RELATIONSHIPS:
		  return {
			  ...state,
			  relationships: action.relationships,
			  relationshipsUpdated: action.relationshipsUpdated,
			  error: false
			};
		case LOADING_RELATIONSHIPS:
		  return {
		  	...state,
		  	relationshipsLoading: action.loading
		  }
		case UPDATED_RELATIONSHIPS_ERROR:
		  return {
		  	...state,
		  	errorResponse: action.response,
		  	error: true
		  }
		default:
			return state;
	}
};
