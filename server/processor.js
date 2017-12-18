import {
	AsyncObject,
	ReadWriteTask,
	ReadWriteScheduler
} from 'async-task-schedulers';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import User from '/server/models/user';
import CropRelationship from '/server/models/crop-relationship';
import Crop from '/server/models/crop';
import Location from '/server/models/location';
import validateUser from '/shared/validation/userValidation';
import validateCredentials from '/shared/validation/loginValidation';
import { Combinations } from '/shared/combinations.js';

class ProcessorException extends Error {
	/**
	 * @param {Number} httpStatusCode
	 */
	constructor(httpStatusCode) {
		super();
		this.httpStatusCode = httpStatusCode;
	}
}

export const VALIDATION_EXCEPTION = new ProcessorException(400);
export const AUTHENTICATION_EXCEPTION = new ProcessorException(401);
export const AUTHORIZATION_EXCEPTION = new ProcessorException(403);

/**
 * Asynchronous object that does database access and all derived calculations.
 *
 * @extends AsyncObject
 */
export class Processor extends AsyncObject {
	constructor() {
		super();

		this.registerTaskParameters('getDocuments', false);
		this.registerTaskParameters('getDocument', false);
		this.registerTaskParameters('getAuthorizedDocuments', false);
		this.registerTaskParameters('getAuthorizedDocument', false);
		this.registerTaskParameters('getAuthenticatedUser', false);
		this.registerTaskParameters('getAllDocuments', false);
		this.registerTaskParameters('getCropsByName', false);
		this.registerTaskParameters('getCropGroups', false);
		this.registerTaskParameters('getCompatibleCrops', false);
		this.registerTaskParameters('getCropRelationshipScores', false);
		this.registerTaskParameters('getCropRelationshipsByCrop', false);
		this.registerTaskParameters('getCropRelationship', false);
		this.registerTaskParameters('login', false);

		this.registerTaskParameters('updateDocument', true);
		this.registerTaskParameters('updateAuthorizedDocument', true);
		this.registerTaskParameters('saveDocument', true);
		this.registerTaskParameters('saveAuthorizedDocument', true);
		this.registerTaskParameters('deleteDocument', true);
		this.registerTaskParameters('deleteAuthorizedDocument', true);
	}

	/**
	 * Create the scheduler that allows only compatible asynchronous methods to
	 * run at the same time.
	 *
	 * TODO: Caching, when needed. One asynchronous method for getting a derived
	 * value, and one for calculating it. When the getter is called if the derived
	 * value is not calculated or it is invalid, the scheduler first runs the
	 * method that calculates the value and only then the getter. When a database
	 * entry is changed, the scheduler orders all the derived values to be
	 * recalculated. Possibly a dependency tree of derived values can be used to
	 * order the calculations.
	 */
	newScheduler() {
		return new ReadWriteScheduler();
	}

	/**
	 * @return {Task}
	 */
	getTaskClass() {
		return ReadWriteTask;
	}

	/**
	 * Validate the given document IDs. Throw TypeError if not valid.
	 *
	 * @param {String[]} ids
	 */
	validate(ids) {
		const allValid = ids.every(mongoose.Types.ObjectId.isValid);
		if (!allValid) {
			throw VALIDATION_EXCEPTION;
		}
	}

	/**
	 * Authorize the given documents. Throw exception if the current user is not
	 * authorized to access one of the documents.
	 *
	 * @param {Document} currentUser
	 * @param {Document[]} documents
	 */
	authorize(currentUser, documents) {
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

		const hasAccess = userIds.every(id => currentUser._id.equals(id));
		if (!hasAccess) {
			throw AUTHORIZATION_EXCEPTION;
		}
	}

	/**
	 * @param {Model} model Mongoose model
	 * @param {String[]} ids Document IDs
	 * @return {Document[]} Array of documents or null if one document was not
	 *                      found.
	 */
	async getDocuments(model, ids) {
		this.validate(ids);

		const path = (model == CropRelationship) ? 'crop0 crop1' : '';
		const documents = await model
			.find({ _id: { $in: ids } })
			.populate(path)
			.exec();

		const foundIds = documents.map(document => document._id.toString());
		const allFound = ids.every(id => foundIds.includes(id));

		return allFound ? documents : null;
	}

	/**
	 * @param {Model} model Mongoose model
	 * @param {String} id Document ID
	 * @return {Document} Document or null if not found
	 */
	async getDocument(model, id) {
		const documents = await this.getDocuments(model, [id]);
		return documents ? documents[0] : null;
	}

	/**
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {String[]} ids
	 */
	async getAuthorizedDocuments(currentUser, model, ids) {
		const documents = await this.getDocuments(model, ids);
		if (!documents) {
			return null;
		}

		this.authorize(currentUser, documents);

		return documents;
	}

	/**
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {String} id
	 */
	async getAuthorizedDocument(currentUser, model, id) {
		const documents = await this.getAuthorizedDocuments(currentUser, model, [
			id
		]);
		return documents ? documents[0] : null;
	}

	/**
	 * Assign an update to the given document and save the updated document.
	 *
	 * @param {Document} document
	 * @param {Object} update Update for the document
	 */
	async updateDocumentInternal(document, update) {
		if (!document) {
			return null;
		}

		delete update._id; // Don't try to update ID
		Object.assign(document, update);

		try {
			await document.save();
		} catch (exception) {
			if (exception instanceof mongoose.Error.ValidationError) {
				throw VALIDATION_EXCEPTION;
			} else {
				throw exception;
			}
		}

		return document;
	}

	/**
	 * @param {Model} model
	 * @param {Object} object
	 */
	async saveDocument(model, object) {
		if (model == CropRelationship) {
			const cropIds = [object.crop0, object.crop1];
			const crops = await this.getDocuments(Crop, cropIds);
			if (/*(cropIds[0] == cropIds[1]) ||*/ !crops) {
				throw VALIDATION_EXCEPTION;
			}

			const relationships = await CropRelationship.find()
				.byCrop(...cropIds)
				.exec();
			if (relationships.length > 0) {
				throw VALIDATION_EXCEPTION;
			}
		} else if (model == User) {
			const { errors, isValid } = validateUser(object);
			if (!isValid) {
				throw VALIDATION_EXCEPTION;
			}
		}

		let document = new model();
		document = await this.updateDocumentInternal(document, object);

		if (model == User) {
			delete document.password;
		}

		return document;
	}

	/**
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {Object} object
	 */
	async saveAuthorizedDocument(currentUser, model, object) {
		this.authorize(currentUser, [object]);
		const document = await this.saveDocument(model, object);
		if (!document) {
			return null;
		}

		if (model == Location) {
			currentUser.locations.push(document);
			await currentUser.save();
		}

		return document;
	}

	/**
	 * Update the given document.
	 *
	 * @param {Model} model
	 * @param {String} id Document ID
	 * @param {Object} update Update for the document
	 * @return {Document} Updated document
	 */
	async updateDocument(model, id, update) {
		const document = await this.getDocument(model, id);
		return await this.updateDocumentInternal(document, update);
	}

	/**
	 * Update the given authorized document.
	 *
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {String} id Document ID
	 * @param {Object} update Update for the document
	 * @return {Document} Updated document
	 */
	async updateAuthorizedDocument(currentUser, model, id, update) {
		const document = await this.getAuthorizedDocument(currentUser, model, id);
		return await this.updateDocumentInternal(document, update);
	}

	/**
	 * Delete the given document.
	 *
	 * @param {Model} model
	 * @param {Document} document
	 */
	async deleteDocumentInternal(model, document) {
		if (model == Crop) {
			await CropRelationship.find()
				.byCrop(document._id)
				.remove();
		}

		await document.remove();
	}

	/**
	 * Delete the given document.
	 *
	 * @param {Model} model
	 * @param {String} id
	 */
	async deleteDocument(model, id) {
		const document = await this.getDocument(model, id);
		await this.deleteDocumentInternal(model, document);
	}

	/**
	 * Delete the given document.
	 *
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {String} id
	 */
	async deleteAuthorizedDocument(currentUser, model, id) {
		const document = await this.getAuthorizedDocument(currentUser, model, id);
		await this.deleteDocumentInternal(model, document);
	}

	/**
	 * @param {String} token
	 */
	async getAuthenticatedUser(token) {
		let userInfo;
		try {
			userInfo = jwt.verify(token, jwtSecret);
		} catch (exception) {
			throw AUTHENTICATION_EXCEPTION;
		}

		const document = await this.getDocument(User, userInfo.id);
		document.populate('locations');
		return document;
	}

	/**
	 * @param {Model} model
	 */
	async getAllDocuments(model) {
		return await model.find({}).exec();
	}

	/**
	 * Processes an array of relationships and calculates compatibility scores for each possible crop
	 *
	 * @param  {Relationship[][]} relationshipTable table of sets of CropRelationships for each crop in ids. All relationships for ids[i] are stored in relationshipTable[i]
	 * @param  {ObjectId[]} ids ids of crops used to fetch each Relationship.
	 * @return {Object} Object mapping crop ids to relationship scores
	 */
	static calculateCropRelationshipScores(relationshipTable, ids) {
		// create an intersection of the relationship relationshipTable
		// crops with any negative interactions will have a value of 0
		// all other crops will give a percentage score which is how many they complement in the set
		const result = {};
		const maxScore = CropRelationship.schema.paths.compatibility.options.max;
		const maxTotal = maxScore * relationshipTable.length;
		for (let i = 0; i < ids.length; i++) {
			const data = relationshipTable[i];
			const queryId = ids[i];
			data.forEach(pair => {
				// look at the one that is NOT the corresponding id in ids
				// at the same index as the current snapshot
				// Because the current data is for the snapshot for a single crop
				const id = pair.crop1.equals(queryId) ? pair.crop0 : pair.crop1;

				// building the relationship scores, storing in result
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
	 * @param {String[]} ids
	 */
	async getCropRelationshipScores(ids) {
		// Check that the crops exist
		const crops = await this.getDocuments(Crop, ids);
		if (!crops) {
			throw VALIDATION_EXCEPTION;
		}

		let cropToRelationships = [];
		for (let index = 0; index < ids.length; index++) {
			const id = ids[index];
			const relationships = await CropRelationship.find()
				.byCrop(id)
				.exec();
			cropToRelationships.push(relationships);
		}

		return Processor.calculateCropRelationshipScores(cropToRelationships, ids);
	}

	/**
	 * @param {Combinations} combinations
	 * @param {Number} maximumGroupSize
	 * @return {Array}
	 */
	static removeCropGroupsFromCombinations(combinations, maximumGroupSize) {
		const groups = [];

		while (maximumGroupSize >= 2) {
			const cursorCombinations = combinations.getCombinations(maximumGroupSize);
			if (cursorCombinations.length > 0) {
				const combination = cursorCombinations[0];
				combinations.removeElements(combination);
				groups.push(combination);
			} else {
				maximumGroupSize--;
			}
		}

		return groups;
	}

	/**
	 * @param {Crop[]} crops
	 */
	async assignRelationships(crops) {
		for (let index = 0; index < crops.length; index++) {
			const crop = (crops[index] = crops[index].toObject());
			crop.relationships = await CropRelationship.find()
				.byCrop(crop._id)
				.exec();
		}
	}

	/**
	 * @param {Crop} crop
	 * @return {Boolean}
	 */
	static isCompanion = function(crop) {
		return this.relationships.some(
			relationship =>
				relationship.containsCrop(crop) && relationship.compatibility > 0
		);
	};

	/**
	 * @param {Crop} crop
	 * @return {Boolean}
	 */
	static isNeutral = function(crop) {
		return this.relationships.some(
			relationship =>
				!relationship.containsCrop(crop) ||
				(relationship.containsCrop(crop) && relationship.compatibility == 0)
		);
	};

	/**
	 * @param {Crop[]} crops
	 * @param {Function} isCompatibleFunction
	 */
	static assignIsCompatible(crops, isCompatibleFunction) {
		crops.forEach(crop => {
			crop.isCompatible = isCompatibleFunction;
		});
	}

	/**
	 * @param {String[]} cropIds
	 * @return {Array}
	 */
	async getCropGroups(cropIds) {
		let crops = await this.getDocuments(Crop, cropIds);
		if (!crops) {
			throw VALIDATION_EXCEPTION;
		}

		await this.assignRelationships(crops);

		let groups = [];

		// Create groups of companion crops
		Processor.assignIsCompatible(crops, Processor.isCompanion);
		const companionCombinations = new Combinations(crops);
		groups = groups.concat(
			Processor.removeCropGroupsFromCombinations(
				companionCombinations,
				companionCombinations.getLargestCombinationSize()
			)
		);

		// From the remaining crops, create small groups of neutral crops
		const remainingCrops = companionCombinations.getElements();
		Processor.assignIsCompatible(remainingCrops, Processor.isNeutral);
		const neutralCombinations = new Combinations(remainingCrops);
		if (neutralCombinations.getLargestCombinationSize() >= 2) {
			groups = groups.concat(
				Processor.removeCropGroupsFromCombinations(neutralCombinations, 2)
			);
		}

		// From the remaining crops, create single crop groups
		groups = groups.concat(neutralCombinations.getCombinations(1));

		groups.forEach(group =>
			group.forEach(crop => {
				delete crop.relationships;
				delete crop.isCompatible;
			})
		);
		return groups;
	}

	/**
	 * @param {String[]} cropIds
	 * @return {Array}
	 */
	async getCompatibleCrops(cropIds) {
		let allCrops = await this.getAllDocuments(Crop);
		await this.assignRelationships(allCrops);
		Processor.assignIsCompatible(allCrops, Processor.isCompanion);
		const combinations = new Combinations(allCrops);

		const initialCrops = cropIds.map(id =>
			allCrops.find(crop => crop._id == id)
		);
		const compatibleCrops = combinations
			.getLargestCombinationWithElements(initialCrops)
			.filter(crop => !initialCrops.includes(crop));

		compatibleCrops.forEach(crop => {
			delete crop.relationships;
			delete crop.isCompatible;
		});
		return compatibleCrops;
	}

	/**
	 * Converts a string into regex-friendly format, escaping all regex special characters
	 * @param	 {String} text string to convert
	 * @return {String}			 escaped string
	 */
	escapeRegEx(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}

	/**
	 * @param {String} regex
	 * @param {Number} index
	 * @param {Number} length
	 */
	async getCropsByName(regex, index, length) {
		console.log('getCropsByName');
		const crops = await Crop.find()
			.byName(this.escapeRegEx(regex))
			.exec();
		return length === 0
				? crops.slice(index)
				: crops.slice(index, index + length);
	}

	/**
	 * @param {String} cropId
	 */
	async getCropRelationshipsByCrop(cropId) {
		const crop = await this.getDocument(Crop, cropId);
		if (!crop) {
			throw VALIDATION_EXCEPTION;
		}

		return await CropRelationship.find()
			.byCrop(cropId)
			.exec();
	}

	/**
	 * @param {String} crop0Id
	 * @param {String} crop1Id
	 */
	async getCropRelationship(crop0Id, crop1Id) {
		const crops = await this.getDocuments(Crop, [
			crop0Id,
			crop1Id
		]);
		if (!crops) {
			throw VALIDATION_EXCEPTION;
		}

		const relationships = await CropRelationship.find()
			.byCrop(crop0Id, crop1Id)
			.exec();
		return relationships ? relationships[0] : null;
	}

	/**
	 * @param {Object} credentials
	 */
	async login(credentials) {
		// First, make sure credentials pass validation
		const { errors, isValid } = validateCredentials(credentials);
		if (!isValid) {
			throw AUTHENTICATION_EXCEPTION;
		}

		// Next make sure the user exists
		const user = await User.find()
			.byUsername(credentials.username)
			.select(['password', 'email', 'username'])
			.exec();

		// Finally, check if password is correct
		if (!await user.checkPassword(credentials.password)) {
			throw AUTHENTICATION_EXCEPTION;
		}

		const token = jwt.sign(
			{ id: user._id, username: user.username, email: user.email },
			jwtSecret
		);
		return { token };
	}
}
