import { SET_CURRENT_LOCATION, LOGOUT } from '/client/actions/types';

export const defaultState = null;

export const currLocation = (state = defaultState, action) => {
	switch (action.type) {
		case SET_CURRENT_LOCATION:
			return action.location;
		case LOGOUT:
			return defaultState;
		default:
			return state;
	}
};
