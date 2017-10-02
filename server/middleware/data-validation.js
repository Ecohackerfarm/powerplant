/**
 * Helper functions and middleware for data validation
 * @namespace data-validation
 * @memberof server.middleware
 */

import mongoose from 'mongoose';
import Crop from '/server/models/crop';
import Companionship from '/server/models/companionship';
import User from '/server/models/user';
import Location from '/server/models/location';
import Bed from '/server/models/bed';
import { checkAccess, checkAccessForUserIds, isAuthenticated } from '/server/middleware/authentication';

import * as myself from './data-validation';
export default myself;

/**
 * Check if the given ids are valid ObjectIds.
 * 
 * @param {String[]} ids List of ids to be checked
 * @param {Function} next
 * @return {boolean} True if all ids are valid
 */
export function idValidator(ids, next) {
	const valid = ids.every(mongoose.Types.ObjectId.isValid);
	if (!valid) {
		const err = new Error();
		err.status = 400;
		err.message = 'Malformed object ID';
		next(err);
		return false;
	}
	
	return true;
}

/**
 * Processes an array of companionships and calculates compatibility scores for each possible crop
 * @param  {Companionship[][]} companionshipTable table of sets of Companionships for each crop in ids. All companionships for ids[i] are stored in companionshipTable[i]
 * @param  {ObjectId[]} ids       ids of crops used to fetch each Companionship.
 * @return {Object}           Object mapping crop ids to companionship scores
 */
export function getCompanionshipScores(companionshipTable, ids) {
	// create an intersection of the companionship companionshipTable
	// crops with any negative interactions will have a value of 0
	// all other crops will give a percentage score which is how many they complement in the set
	const result = {};
	const maxScore = Companionship.schema.paths.compatibility.options.max;
	const maxTotal = maxScore * companionshipTable.length;
	for (let i = 0; i < ids.length; i++) {
		const data = companionshipTable[i];
		const queryId = ids[i];
		data.forEach(pair => {
			// look at the one that is NOT the corresponding id in ids
			// at the same index as the current snapshot
			// Because the current data is for the snapshot for a single crop
			const id = pair.crop2.equals(queryId) ? pair.crop1 : pair.crop2;

			// building the companionship scores, storing in result
			// if a companion crop is incompatible with any query crop, its score will be -1
			// otherwise, it will be the average of all of its compatiblity scores with the query crops
			if (pair.compatibility === -1) {
				result[id] = -1;
			} else if (pair.compatibility !== -1 && result.hasOwnProperty(id)) {
				if (result[id] !== -1) {
					result[id] += pair.compatibility / maxTotal;
				}
			} else {
				result[id] = pair.compatibility / maxTotal;
			}
		});
	}
	return result;
}

/**
 *
 */
export async function fetchDocumentsById(model, ids, path, next) {
	let documents;
	try {
		documents = await model.find({ _id: { $in: ids } }).populate(path).exec();
		let foundIds = documents.map((document) => (document._id.toString()));
		let allFound = ids.every((id) => (foundIds.includes(id)));
		if (!allFound) {
			throw "error";
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
 *
 */
export async function fetchDocumentById(model, id, path, next) {
	let documents;
	if (!(documents = await fetchDocumentsById(model, [id], path, next))) {
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
export async function getDocumentById(req, model, id, path, next) {
	const authenticate = ((model !== Companionship) && (model !== Crop));
	
	if (authenticate && (!isAuthenticated(req, next))) {
		return null;
	}
	
	if (!idValidator([id], next)) {
		return null;
	}
	
	let document;
	if (!(document = await fetchDocumentById(model, id, path, next))) {
		return null;
	}
	
	if (authenticate) {
		let userId = req.user._id;
		if (model === User) {
			if (!checkAccessForUserIds(userId, [document._id], next)) {
				return null;
			}
		} else {
			if (!checkAccess(userId, [document], next)) {
				return null;
			}
		}
	}
	
	return document;
}

/**
 * Converts a string into regex-friendly format, escaping all regex special characters
 * @param  {String} text string to convert
 * @return {String}      escaped string
 */
export function escapeRegEx(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
