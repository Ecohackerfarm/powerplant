import {
	ADD_LOCATION,
	SET_LOCATIONS,
	EDIT_LOCATION,
	DELETE_LOCATION,
	LOGOUT
} from '/client/actions/types';

export const defaultState = {};

export const locations = (state = defaultState, action) => {
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
			let newState = {...state};
			delete newState[action.id];
			return newState;
		}
		case LOGOUT:
			return defaultState;
		default:
			return state;
	}
};
