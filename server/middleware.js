import { processor } from '/server/app';
import {
	VALIDATION_EXCEPTION,
	AUTHORIZATION_EXCEPTION,
	AUTHENTICATION_EXCEPTION
} from '/server/processor';
import Location from '/server/models/location';
import User from '/server/models/user';
import CropRelationship from '/server/models/crop-relationship';
import Crop from '/server/models/crop';

const MAX_NAME_ENTRIES = 200000;
const MAX_RESPONSE_LENGTH = 200000;

/**
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
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getAllCropRelationships(req, res, next) {
	try {
		// get all combinations - this is REALLY slow (over 2s) but it's also a huge request
		// could consider pagination - return 50 results and a link to the next 50
		const relationships = await processor.getAllDocuments(CropRelationship);
		res.json(relationships);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getCropsByName(req, res, next) {
	try {
		const name = req.query.name;
		if (typeof name != 'string') {
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
