/**
 * @namespace actionHelpers
 * @memberof client.actions
 */

import { store } from '../index';
import axios from 'axios';

/**
 * A convenience function which passes dispatch to authAction if authorized and passes it to nonAuthAction if not authorized
 * @function
 * @param  {client.actions.actionHelpers~dispatchCallback} authAction    callback if authorized
 * @param  {client.actions.actionHelpers~dispatchCallback} nonAuthAction callback if not authorized
 * @return {Object}              the results of either authAction or nonAuthAction
 */
export const authCheckedRequest = (authAction, nonAuthAction) => {
	return (dispatch, getState) => {
		if (getState().auth.isAuthenticated) {
			return authAction(dispatch);
		} else {
			return nonAuthAction(dispatch);
		}
	};
};

/**
 * @callback client.actions.actionHelpers~dispatchCallback
 * @param {Function} dispatch the redux dispatch object
 */

/**
 * If authorized, exectues a simple HTTP request and then dispatches a single action if successful.
 * If not authorized, dispatches the action.
 * @function
 * @param  {String} url          the URL of the HTTP request
 * @param  {String} method       HTTP method in lower case
 * @param  {Function} action       function to build an action from the action params
 * @param  {Array} actionParams parameters of the action builder function
 * @return {client.actions.responseObject}
 */
export const simpleAuthCheckedRequest = (
	url,
	method,
	action,
	...actionParams
) => {
	return authCheckedRequest(
		dispatch =>
			axios[method](url).then(res => {
				let success = true;
				if (res.status >= 200 && res.status < 300) {
					dispatch(action(...actionParams));
				} else {
					success = false;
				}
				return { success };
			}),
		dispatch =>
			new Promise(resolve => {
				dispatch(action(...actionParams));
				resolve({ success: true });
			})
	);
};
