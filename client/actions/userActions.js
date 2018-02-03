/**
 * @namespace userActions
 * @memberof client.actions
 */

import axios from 'axios';
import { setAuthorizationToken } from '../utils';
import jwtDecode from 'jwt-decode';
import { setCurrentUser, logoutUser } from '.';
import { getLocationsRequest, saveLocationRequest } from './locationActions';

// creating a thunk action that dispatches SET_CURRENT_USER once the sign up request is successful
// the desired functionality: a user creates an account, and all local data that they had previously
// saved while not logged in gets saved to their new account, and they become authenticated as that user
/**
 * Async submits a request to create a new user to the server. If successful, dispatches a {@link client.actions.userActions.userLoginRequest userLoginRequest}
 * @param  {Object} userData user's login information
 * @param {String} userData.username
 * @param {String} userData.email
 * @param {String} userData.password
 * @return {Promise} which resolves to whatever the {@link client.actions.userActions.userLoginRequest userLoginRequest} would resolve to
 */
export function userSignupRequest(userData, locations) {
	// TODO: once the back end is ready to handle it, should be able to just nest all data you want to save within the userData
	// and post that, and have it all save to the back end with new ids automatically
	return dispatch =>
		axios
			.post('/api/users', userData)
			.then(res => {
				return dispatch(userLoginRequest(userData));
			})
			.then(({ success }) => {
				// time to post all the locations!
				const requests = locations.map(location => {
					delete location._id; // cast off that old ID!
					return dispatch(saveLocationRequest(location));
				});
				return { success: requests.every(req => req.success) };
			});
}

// creating a thunk action that only dispatches a SET_CURRENT_USER request
// once the login request is successful
/**
 * Async submits a request for an auth token, then dispatches {@link client.actions.userActions.setUserFromToken setUserFromToken} if successful
 * @param  {Object} loginData
 * @param {String} loginData.username
 * @param {String} loginData.password
 * @return {Promise} the network request
 */
export function userLoginRequest(loginData) {
	return dispatch => {
		return axios.post('/api/login', loginData).then(res => {
			if (res.status === 200) {
				dispatch(setUserFromToken(res.data.token));
			}
			console.log('Dispatched request, returning');
			return res;
		});
	};
}

/**
 * Async attempt to set the current user from a JWT token. Sets the
 * authorization token, saves in local storage, and then dispatches
 * actions {@link client.actions.setCurrentUser setCurrentUser} and
 * {@link client.actions.locationActions.getLocationsRequest getLocationsRequest}.
 * 
 * TODO: jwtToken is loaded and saved to localStorage, but there's
 * no reason not to switch this to the persistent redux store. i just
 * haven't gotten to it. pretty sure redux-persist uses localStorage anyway
 * 
 * @function
 * @param {String} token JSON Web Token
 */
export function setUserFromToken(token) {
	return dispatch => {
		setAuthorizationToken(token);
		localStorage.setItem('jwtToken', token);
		const user = jwtDecode(token);
		dispatch(setCurrentUser(user));
		dispatch(getLocationsRequest(user.id));
	};
}

/**
 * Async attempt to logout the current user, then dispatch a {@link client.actions.logoutUserAction logoutUserAction}
 * @return {None}
 */
export function userLogoutRequest() {
	return dispatch => {
		setAuthorizationToken(false);
		localStorage.removeItem('jwtToken');
		dispatch(logoutUser());
	};
}
