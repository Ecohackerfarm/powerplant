/**
 * Express middleware functions
 * @namespace middleware
 * @memberof server
 */

import { getDocumentById } from './data-validation.js';
import Crop from '/server/models/crop';
import Companionship from '/server/models/companionship';

/**
 * Does the GET operation of fetching a document by it's ID.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next
 * @param {Model} model
 * @param {String} id
 */
export async function doGet(req, res, next, model, id) {
	let path = (model === Companionship) ? 'crop1 crop2' : '';
	
	let document;
	if (!(document = await getDocumentById(req, model, id, path, next))) {
		return;
	}
	
	res.status(200).json(document);
}

/**
 * Does the PUT operation of updating a document.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next
 * @param {Model} model
 * @param {String} id
 */
export async function doPut(req, res, next, model, id) {
	let document;
	if (!(document = await getDocumentById(req, model, id, '', next))) {
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
}

/**
 * Does the DELETE operation of deleting a document.
 *
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next
 * @param {Model} model
 * @param {String} id
 */
export async function doDelete(req, res, next, model, id) {
	let document;
	if (!(document = await getDocumentById(req, model, id, '', next))) {
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
}
