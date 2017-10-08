/**
 * Express middleware functions
 * @namespace middleware
 * @memberof server
 */

import { getAuthenticatedUser, isAuthorized } from '/server/middleware/authentication';
import { idValidator } from './data-validation';
import Crop from '/server/models/crop';
import Companionship from '/server/models/companionship';

/**
 * Fetch documents from the database.
 *
 * @param {Model} model
 * @param {String[]} ids
 * @param {String} path Paths to be populated
 * @param {Function} next
 */
export async function getDocuments(model, ids, path, next) {
	if (!idValidator(ids, next)) {
		return null;
	}
	
	let documents;
	try {
		documents = await model.find({ _id: { $in: ids } }).populate(path).exec();
		let foundIds = documents.map((document) => (document._id.toString()));
		let allFound = ids.every((id) => (foundIds.includes(id)));
		if (!allFound) {
			throw new Error("Error");
		}
	} catch (exception) {
		const error = new Error();
		error.status = 404;
		error.message = 'Document was not found';
		next(error);
		return null;
	}
	
	return documents;
}

/**
 * Fetch a document from the database.
 * 
 * @param {Object} req Request object
 * @param {Model} model Mongoose model
 * @param {String} id Document ID
 * @param {String} path Paths to be populated
 * @param {Function} next
 */
export async function getDocument(req, model, id, path, next) {
	let documents = await getDocuments(model, [id], path, next);
	if (!documents) {
		return null;
	}
	
	return documents[0];
}

/**
 * Check if the request has been authenticated, and fetch a document from
 * the database.
 *
 * @param {Object} req Request object
 * @param {Model} model Mongoose model
 * @param {String} id Document ID
 * @param {String} path Paths to be populated
 * @param {Function} next
 * @return {Object} Mongoose document
 */
export async function getAuthorizedDocument(req, model, id, path, next) {
	const user = await getAuthenticatedUser(req, next);
	if (!user) {
		return null;
	}
	
	let document = await getDocument(req, model, id, path, next);
	if (!document) {
		return null;
	}
	
	if (!isAuthorized(user, [document], next)) {
		return null;
	}
	
	return document;
}

/**
 * Creates an asynchronous function that does the GET operation of fetching a
 * document by its ID.
 *
 * @param {AsyncFunction} getDocumentFunction
 */
function newDoGet(getDocumentFunction) {
	return async function(req, res, next, model, id) {
		let path = (model === Companionship) ? 'crop1 crop2' : '';
		let document = await getDocumentFunction(req, model, id, path, next);
		if (!document) {
			return;
		}
		
		res.status(200).json(document);
	};
}

export const doGet = newDoGet(getDocument);
export const doAuthorizedGet = newDoGet(getAuthorizedDocument);

/**
 * Creates an asynchronous function that does the PUT operation of updating
 * a document.
 *
 * @param {AsyncFunction} getDocumentFunction
 */
function newDoPut(getDocumentFunction) {
	return async function(req, res, next, model, id) {
		let document = await getDocumentFunction(req, model, id, '', next);
		if (!document) {
			return;
		}
		
		delete req.body._id; // Don't try to update ID
		Object.assign(document, req.body);
		try {
			document = await document.save();
		} catch (exception) {
			return next({ status: 400, message: 'Could not update document' });
		}
		
		res.status(200).json(document);
	};
}

export const doPut = newDoPut(getDocument);
export const doAuthorizedPut = newDoPut(getAuthorizedDocument);

/**
 * Creates an asynchronous function that does the DELETE operation of deleting
 * a document.
 *
 * @param {AsyncFunction} getDocumentFunction
 */
function newDoDelete(getDocumentFunction) {
	return async function(req, res, next, model, id) {
		let document = await getDocumentFunction(req, model, id, '', next);
		if (!document) {
			return;
		}
		
		if (model === Crop) {
			try {
				await Companionship.find().byCrop(id).remove();
			} catch (exception) {
				return next({ status: 500, message: 'Error' });
			}
		}
		
		try {
			await document.remove();
		} catch (exception) {
			return next({ status: 400, message: 'Could not delete document' });
		}
		
		/*
		 * RFC 2616: A successful response SHOULD be 204 (No Content) if the
		 * action has been enacted but the response does not include an entity.
		 */
		res.status(204).json();
	};
}

export const doDelete = newDoDelete(getDocument);
export const doAuthorizedDelete = newDoDelete(getAuthorizedDocument);
