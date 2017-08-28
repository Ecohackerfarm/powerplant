import {
	ADD_LOCATION,
	SET_LOCATIONS,
	EDIT_LOCATION,
	DELETE_LOCATION,
	LOGOUT
} from '/client/actions/types';

export const defaultState = [];

export const locations = (state = defaultState, action) => {
	switch (action.type) {
		case SET_LOCATIONS:
			return action.locations;
		case ADD_LOCATION:
			return state.concat(action.location);
		case EDIT_LOCATION: {
			return state.map(loc => ((loc._id === action.id) ? Object.assign({}, loc, action.changes) : loc));
		}
		case DELETE_LOCATION: {
			return state.filter(loc => (loc._id !== action.id));
		}
		case LOGOUT:
			return defaultState;
		default:
			return state;
	}
};
