import * as types from '/client/actions/types';

export const auth = (state = { isAuthenticated: false }, action) => {
	switch (action.type) {
		case types.SET_CURRENT_USER:
			if (action.user) {
				return {
					isAuthenticated: true,
					currentUser: action.user
				};
			} else {
				return {
					isAuthenticated: false
				};
			}
		case types.CREATE_USER:
			// I think that nothing happens here but I will leave it
			// just in case
			return state;
		case types.LOGOUT:
			return {
				isAuthenticated: false
			};
		default:
			return state;
	}
};
