import { SET_CURRENT_LOCATION, LOGOUT } from '../actions';

const initialState = null;

export function currLocation(state = initialState, action) {
	switch (action.type) {
		case SET_CURRENT_LOCATION:
			return action.location;
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
}
