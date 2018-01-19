/**
 * Middleware functions produce responses to HTTP clients by talking with
 * the Processor object to access database documents and do calculations.
 * 
 * @namespace middleware
 * @memberof server
 */

import { processor } from './app';
import {
	VALIDATION_EXCEPTION,
	AUTHORIZATION_EXCEPTION,
	AUTHENTICATION_EXCEPTION
} from './processor';
import Location from './models/location';
import User from './models/user';
import CropRelationship from './models/crop-relationship';
import Crop from './models/crop';

const MAX_NAME_ENTRIES = 200000;
const MAX_RESPONSE_LENGTH = 200000;

/**
 * Produce error response for the client by consuming the given exception
 * that occurred during processing.
 * 
 * @param {Function} next
 * @param {Error} exception
 */
function handleError(next, exception) {
	if (exception == VALIDATION_EXCEPTION) {
		next({ status: exception.httpStatusCode, message: 'Invalid input' });
	} else if (exception == AUTHORIZATION_EXCEPTION) {
		next({ status: exception.httpStatusCode, message: 'Not authorized' });
	} else if (exception == AUTHENTICATION_EXCEPTION) {
		next({ status: exception.httpStatusCode, message: 'Not authenticated' });
	} else {
		next({ status: 500, message: 'Error' });
	}
}

/**
 * Parse integer and validate that it is in the given range.
 *
 * @param {Function} next
 * @param {String} string
 * @param {Number} minimum
 * @param {Number} maximum
 * @param {Number} defaultValue
 * @return {Number}
 */
function parseInteger(next, string, minimum, maximum, defaultValue) {
	let value;
	try {
		if (string === undefined) {
			if (defaultValue === undefined) {
				throw new Error();
			} else {
				return defaultValue;
			}
		}

		value = Number(string);
	} catch (exception) {
		handleError(next, VALIDATION_EXCEPTION);
	}

	if (value < minimum || value > maximum) {
		handleError(next, VALIDATION_EXCEPTION);
	}

	return value;
}

/**
 * Requests that need authorization have the authorization token that
 * originates from the login process. Get the User document that corresponds
 * to the given authorization token, or throw exception if the authentication
 * fails.
 * 
 * @param {Object} req
 * @param {Function} next
 * @return {User}
 */
async function getAuthenticatedUser(req, next) {
	const header = req.headers['authorization'];
	if (!header) {
		throw AUTHENTICATION_EXCEPTION;
	}
	const [, token] = header.split(' ');
	return await processor.getAuthenticatedUser(token);
}

/**
 * Document types that need authorization.
 */
const authorizedModels = [Location];

/**
 * Fetch database document with the given id.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {Model} model
 */
export async function documentGet(req, res, next, model) {
	try {
		const id = req.params.id;

		let document;
		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next);
			document = await processor.getAuthorizedDocument(
				authenticatedUser,
				model,
				id
			);
		} else {
			document = await processor.getDocument(model, id);
		}

		if (!document) {
			return next({ status: 404, message: 'Not found' });
		}

		res.status(200).json(document);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Update database document.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {Model} model
 */
export async function documentPut(req, res, next, model) {
	try {
		const id = req.params.id;
		const update = req.body;

		let document;
		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next);
			document = await processor.updateAuthorizedDocument(
				authenticatedUser,
				model,
				id,
				update
			);
		} else {
			document = await processor.updateDocument(model, id, update);
		}

		if (!document) {
			return next({ status: 404, message: 'Not found' });
		}

		res.status(200).json(document);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Create new document.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {Model} model
 */
export async function documentPost(req, res, next, model) {
	try {
		let document;
		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next);
			document = await processor.saveAuthorizedDocument(
				authenticatedUser,
				model,
				req.body
			);
		} else {
			document = await processor.saveDocument(model, req.body);
		}

		res.status(201).json(document);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Delete a document.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {Model} model
 */
export async function documentDelete(req, res, next, model) {
	try {
		const id = req.params.id;

		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next);
			await processor.deleteAuthorizedDocument(authenticatedUser, model, id);
		} else {
			await processor.deleteDocument(model, id);
		}

		/*
		 * RFC 2616: A successful response SHOULD be 204 (No Content) if the
		 * action has been enacted but the response does not include an entity.
		 */
		res.status(204).json();
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Get all crop relationships.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getAllCropRelationships(req, res, next) {
	try {
		const relationships = await processor.getAllDocuments(CropRelationship);
		res.json(relationships);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Get crops whose name matches the given regular expression.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getCropsByName(req, res, next) {
	try {
		const name = req.query.name;
		if (typeof name !== 'string') {
			throw VALIDATION_EXCEPTION;
		}
		const index = parseInteger(next, req.query.index, 0, MAX_NAME_ENTRIES, 0);
		const length = parseInteger(
			next,
			req.query.length,
			0,
			MAX_RESPONSE_LENGTH,
			0
		);

		const crops = await processor.getCropsByName(name, index, length);
		res.json(crops);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Given a set of crop IDs, divide the set into groups that contain
 * compatible crops.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getCropGroups(req, res, next) {
	try {
		const groups = await processor.getCropGroups(req.body.cropIds);
		res.json(groups);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Given a set of crop IDs, find all other crops that are compatible
 * with the given crops. All crops in the sum group are compatible with
 * each other.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getCompatibleCrops(req, res, next) {
	try {
		const crops = await processor.getCompatibleCrops(req.body.cropIds);
		res.json(crops);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Get the user's locations.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getLocations(req, res, next) {
	try {
		const user = await getAuthenticatedUser(req, next);
		res.status(200).json(user.locations);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * Login with username and password, and respond with
 * authorization token.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function login(req, res, next) {
	try {
		const result = await processor.login(req.body);
		res.json(result);
	} catch (exception) {
		handleError(next, exception);
	}
}
