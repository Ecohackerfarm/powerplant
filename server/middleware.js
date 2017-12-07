import { processor } from '/server/app';
import {
	VALIDATION_EXCEPTION,
	AUTHORIZATION_EXCEPTION,
	AUTHENTICATION_EXCEPTION
} from '/server/processor';
import Location from '/server/models/location';
import User from '/server/models/user';
import Companionship from '/server/models/companionship';
import Organism from '/server/models/organism';

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
	return await processor.call('getAuthenticatedUser', token);
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
			document = await processor.call(
				'getAuthorizedDocument',
				authenticatedUser,
				model,
				id
			);
		} else {
			document = await processor.call('getDocument', model, id);
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
			document = await processor.call(
				'updateAuthorizedDocument',
				authenticatedUser,
				model,
				id,
				update
			);
		} else {
			document = await processor.call('updateDocument', model, id, update);
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
			document = await processor.call(
				'saveAuthorizedDocument',
				authenticatedUser,
				model,
				req.body
			);
		} else {
			document = await processor.call('saveDocument', model, req.body);
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
			await processor.call(
				'deleteAuthorizedDocument',
				authenticatedUser,
				model,
				id
			);
		} else {
			await processor.call('deleteDocument', model, id);
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
export async function getAllCompanionships(req, res, next) {
	try {
		// get all combinations - this is REALLY slow (over 2s) but it's also a huge request
		// could consider pagination - return 50 results and a link to the next 50
		const companionships = await processor.call(
			'getAllDocuments',
			Companionship
		);
		res.json(companionships);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getCompanionshipsByOrganism(req, res, next) {
	try {
		const companionships = await processor.call(
			'getCompanionshipsByOrganism',
			req.params.organismId
		);
		res.json(companionships);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getCompanionshipScores(req, res, next) {
	try {
		const ids = (req.query.id || '').split(',');
		const scores = await processor.call('getCompanionshipScores', ids);

		res.json(scores);
	} catch (exception) {
		handleError(next, exception);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getOrganismsByName(req, res, next) {
	try {
		let organisms;
		if (typeof req.query.name !== 'undefined') {
			organisms = await processor.call('getOrganismsByName', req.query.name);
		} else {
			organisms = await processor.call('getAllDocuments', Organism);
		}

		res.json(organisms);
	} catch (exeption) {
		handleError(next, exception);
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function getCompanionship(req, res, next) {
	try {
		const companionship = await processor.call(
			'getCompanionship',
			req.params.organism0Id,
			req.params.organism1Id
		);

		if (companionship) {
			res
				.status(303)
				.location('/api/companionships/' + companionship._id)
				.send();
		} else {
			res.status(204).json();
		}
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
		const result = await processor.call('login', req.body);
		res.json(result);
	} catch (exception) {
		handleError(next, exception);
	}
}
