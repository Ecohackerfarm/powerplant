/**
 * Helper functions and middleware for data validation
 * @namespace data-validation
 * @memberof server.middleware
 */

import mongoose from 'mongoose';
import Companionship from '/server/models/companionship';

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
 *
 * TODO: Move to somewhere else.
 *
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
 * Converts a string into regex-friendly format, escaping all regex special characters
 * @param  {String} text string to convert
 * @return {String}      escaped string
 */
export function escapeRegEx(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
