/**
 * Middleware functions produce responses to HTTP clients by executing
 * database transactions and other actions to obtain results.
 * 
 * @namespace middleware
 * @memberof server
 */

const Location = require('./models/location');
const User = require('./models/user');
const CropRelationship = require('./models/crop-relationship');
const Crop = require('./models/crop');
const { debug } = require('./utils');
const processor = require('./processor');
const {
	VALIDATION_EXCEPTION,
	AUTHORIZATION_EXCEPTION,
	AUTHENTICATION_EXCEPTION
} = require('./processor');
const mongoose = require('mongoose');

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
	debug(exception);
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
 * Commit transaction and end session.
 *
 * @param {Object} session
 */
async function endSessionAndTransaction(session) {
	await session.commitTransaction();
	session.endSession();
}

/**
 * Start session and transaction.
 *
 * @return {Object} Session object
 */
async function startSessionAndTransaction() {
	const session = await mongoose.startSession();
	startTransaction(session);
	return session;
}

/**
 * Start transaction where reads are guaranteed to be done from single
 * snapshot.
 *
 * @param {Object} session
 */
function startTransaction(session) {
	session.startTransaction({
		readConcern: {
			level: 'snapshot'
		}
	});
}

/**
 * Requests that need authorization have the authorization token that
 * originates from the login process. Get the User document that corresponds
 * to the given authorization token, or throw exception if the authentication
 * fails.
 * 
 * @param {Object} req
 * @param {Function} next
 * @param {Object} session
 * @return {User}
 */
async function getAuthenticatedUser(req, next, session) {
	const header = req.headers['authorization'];
	if (!header) {
		throw AUTHENTICATION_EXCEPTION;
	}
	const [, token] = header.split(' ');
	return await processor.getAuthenticatedUser(session, token);
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
async function documentGet(req, res, next, model) {
	try {
		const id = req.params.id;

		const session = await startSessionAndTransaction();
		let document;
		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next, session);
			document = await processor.getAuthorizedDocument(
				session,
				authenticatedUser,
				model,
				id
			);
		} else {
			document = await processor.getDocument(session, model, id);
		}
		await endSessionAndTransaction(session);

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
async function documentPut(req, res, next, model) {
	try {
		const id = req.params.id;
		const update = req.body;

		const session = await startSessionAndTransaction();
		let document;
		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next, session);
			document = await processor.updateAuthorizedDocument(
				session,
				authenticatedUser,
				model,
				id,
				update
			);
		} else {
			document = await processor.updateDocument(session, model, id, update);
		}
		await endSessionAndTransaction(session);

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
async function documentPost(req, res, next, model) {
	try {
		const session = await startSessionAndTransaction();
		let document;
		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next, session);
			document = await processor.saveAuthorizedDocument(
				session,
				authenticatedUser,
				model,
				req.body
			);
		} else {
			document = await processor.saveDocument(session, model, req.body);
		}
		await endSessionAndTransaction(session);

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
async function documentDelete(req, res, next, model) {
	try {
		const id = req.params.id;

		const session = await startSessionAndTransaction();
		if (authorizedModels.includes(model)) {
			const authenticatedUser = await getAuthenticatedUser(req, next, session);
			await processor.deleteAuthorizedDocument(session, authenticatedUser, model, id);
		} else {
			await processor.deleteDocument(session, model, id);
		}
		await endSessionAndTransaction(session);

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
async function getAllCropRelationships(req, res, next) {
	try {
		const session = await startSessionAndTransaction();
		const relationships = await processor.getAllDocuments(session, CropRelationship);
		await endSessionAndTransaction(session);
		
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
async function getCropsByName(req, res, next) {
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

		const session = await startSessionAndTransaction();
		const crops = await processor.getCropsByName(session, name, index, length);
		await endSessionAndTransaction(session);

		debug('getCropsByName():');
		debug(crops);

		res.json(crops);
	} catch (exception) {
		console.log(exception);
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
async function getCropGroups(req, res, next) {
	try {
		const session = await startSessionAndTransaction();
		const groups = await processor.getCropGroups(session, req.body.cropIds);
		await endSessionAndTransaction(session);

		debug('getCropGroups():');
		debug(groups);

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
async function getCompatibleCrops(req, res, next) {
	try {
		const session = await startSessionAndTransaction();
		const crops = await processor.getCompatibleCrops(session, req.body.cropIds);
		await endSessionAndTransaction(session);

		debug('getCompatibleCrops():');
		debug(crops);

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
async function getLocations(req, res, next) {
	try {
		const session = await startSessionAndTransaction();
		const user = await processor.getAuthenticatedUser(session, req, next);
		await endSesssionAndTransaction(session);
		
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
async function login(req, res, next) {
	try {
		const session = await startSessionAndTransaction();
		const result = await processor.login(session, req.body);
		await endSessionAndTransaction(session);
		res.json(result);
	} catch (exception) {
		handleError(next, exception);
	}
}

module.exports = {
	documentGet,
	documentPut,
	documentPost,
	documentDelete,
	getAllCropRelationships,
	getCropsByName,
	getCropGroups,
	getCompatibleCrops,
	getLocations,
	login
};
