/**
 * Authentication express middleware functions
 * @namespace authentication
 * @memberof server.middleware
 */

import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import User from '/server/models/user';

/**
 * Express middleware to check if a request has authentication.
 * If an authorization header exists, it will either save the user in req.user (if authenticated), or send a 401/404
 * depending if it's an invalid token or if the user doesn't exist
 * If it doesn't exist, this function does nothing and calls next()
 * @function
 * @param  {Object}   req  request object
 * @param  {Object}   res  response object
 * @param  {Function} next
 * @return {None}
 */
export const authenticate = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (authHeader) {
		const [, token] = authHeader.split(' ');
		jwt.verify(token, jwtSecret, (err, user) => {
			if (err) {
				next({ status: 401, message: 'Invalid authentication' });
			} else {
				User.findById(user.id, (err, userMatch) => {
					if (userMatch) {
						req.user = userMatch;
						next();
					} else {
						next({ status: 404, message: 'User does not exist' });
					}
				});
			}
		});
	} else {
		next();
	}
};

/**
 * Check if the request has been authenticated.
 *
 * @param {Object} req Request object
 * @param {String} message Error message to go with HTTP 401.
 * @return {boolean} True if authenticated
 */
export function isAuthenticated(req, next) {
	if (!req.user) {
		next({ status: 401, message: 'Authentication required' });
		return false;
	}
	
	return true;
};

/**
 * Check if the current user matches the given user IDs.
 *
 * @param {String} userId ID of current user
 * @param {String[]} User IDs
 * @param {String} message Error message to go with HTTP 403
 * @return {boolean} True if matches with all given IDs
 */
export function checkAccessForUserIds(userId, userIds, next) {
	let hasAccess = userIds.every(id => userId.equals(id));
	if (!hasAccess) {
		next({ status: 403, message: 'No permission to access document' });
		return false;
	}
	
	return true;
};

/**
 * Check if the current user has access to the given documents.
 *
 * @param {String} userId
 * @param {String[]} documents
 * @param {Function} next
 * @return {boolean} True if user has access
 */
export function checkAccess(userId, documents, next) {
	let userIds = documents.map(document => document.user);
	return checkAccessForUserIds(userId, userIds, next);
};
