import * as types from '../actions/types';

/**
 * @typedef client.reducers.authdefaultState {Object}
 * @prop {Boolean} [isAuthenticated=false]
 */

/**
 * @function auth
 * @param {Object} [state={@link client.reducers.auth~defaultState defaultState}]
 * @param {Boolean} state.isAuthenticated - is a user logged in or not
 * @param {Object} state.user - current user's information
 * @param {String} state.user.username - current user's username
 * @param {String} state.user.email - current user's email
 * @param {client.actions.setCurrentUserAction|client.actions.createUserAction} action - the action to be performed. all other action types will be ignored
 * @return {state}
 */

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
