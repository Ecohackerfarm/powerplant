import {
	CROPS_UPDATED,
	CROP_RELATIONSHIPS_UPDATED,
	CROPS_LOADING_ERROR,
	CROPS_LOADING,
	CROP_RELATIONSHIPS_LOADING,
	CROP_RELATIONSHIPS_LOADING_ERROR
} from '../actions';

const initialState = {
	all: [],
	loading: false,
	updated: 0,
	errorResponse: {},
	error: false,
	relationshipsLoading : false,
	relationshipsUpdated : 0,
	relationships : []
};

export function crops(state = initialState, action) {
	switch (action.type) {
		case CROPS_UPDATED:
			return {
			  ...state,
			  all: action.all,
			  updated: action.updated,
			  error: false
			};
		case CROPS_LOADING:
		  return {
		  	...state,
		  	loading: action.loading
		  }
		case CROPS_LOADING_ERROR:
		  return {
		  	...state,
		  	errorResponse: action.response,
		  	error: true
		  }
		case CROP_RELATIONSHIPS_UPDATED:
		  return {
			  ...state,
			  relationships: action.relationships,
			  relationshipsUpdated: action.relationshipsUpdated,
			  error: false
			};
		case CROP_RELATIONSHIPS_LOADING:
		  return {
		  	...state,
		  	relationshipsLoading: action.loading
		  }
		case CROP_RELATIONSHIPS_LOADING_ERROR:
		  return {
		  	...state,
		  	errorResponse: action.response,
		  	error: true
		  }
		default:
			return state;
	}
};
