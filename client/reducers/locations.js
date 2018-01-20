import {
	ADD_LOCATION,
	SET_LOCATIONS,
	EDIT_LOCATION,
	DELETE_LOCATION,
	EDIT_BED,
	ADD_BED,
	DELETE_BED,
	LOGOUT,
} from '../actions';

const initialState = {};

export function locations(state = initialState, action) {
	let newState;
	switch (action.type) {
		case SET_LOCATIONS:
			return action.locations;
		case ADD_LOCATION:
			return {
				...state,
				...action.locationEntry
			};
		case EDIT_LOCATION: {
			return {
				...state,
				//take old location and override changes
				[action.id] : {
					...state[action.id],
					...action.changes
				}
			};
		}
		case DELETE_LOCATION: {
			newState = {...state};
			delete newState[action.id];
			return newState;
		}
		case ADD_BED:
		  newState = { ...state };
		  //add beds in newState in the specified location
		  newState[action.locationId].beds = {
		  	...newState[action.locationId].beds,
		  	...action.bedEntry
		  }
			return newState;
		case EDIT_BED:
		  newState = { ...state };
		  //add beds in newState in the specified location
		  newState[action.locationId].beds[action.bedId] = {
		  	...newState[action.locationId].beds[action.bedId],
		  	...action.changes
		  }
			return newState;
		case DELETE_BED:
		  newState = { ...state };
		  //add beds in newState in the specified location
		  delete newState[action.locationId].beds[action.bedId];
			return newState;
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};
