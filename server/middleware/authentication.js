/**
 * Authentication express middleware functions
 * @namespace authentication
 * @memberof server.middleware
 */

import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import User from '/server/models/user';
import { getDocument } from '/server/middleware';

/**
 * Check if the request has been authenticated.
 *
 * @param {Object} req Request object
 * @param {Functino} next
 * @return {Document} User document, or null if authentication failed
 */
export async function getAuthenticatedUser(req, next) {
	const header = req.headers['authorization'];
	
	if (!header) {
		next({ status: 401, message: 'Authentication required' });
		return null;
	}
	
	const [, token] = header.split(' ');
	
	let userInfo;
	try {
		userInfo = jwt.verify(token, jwtSecret);
	} catch (exception) {
		next({ status: 401, message: 'Authentication failed' });
		return null;
	}
	
	return await getDocument(req, User, userInfo.id, '', next);
}

/**
 * Check if the authenticated user is authorized to access the given documents.
 *
 * @param {Object} user Authenticated user
 * @param {Object[]} documents
 * @return {boolean}
 */
export function isAuthorized(user, documents, next) {
	/*
	 * All documents that need authorization, except User documents, have the
	 * 'user' property.
	 */
	let userIds;
	if (documents[0].user) {
		userIds = documents.map(document => document.user);
	} else {
		userIds = documents.map(document => document._id);
	}
	
	const hasAccess = userIds.every(id => user._id.equals(id));
	if (!hasAccess) {
		next({ status: 403, message: 'Not authorized' });
		return false;
	}
	
	return true;
}
