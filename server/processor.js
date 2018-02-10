/**
 * @namespace processor
 * @memberof server
 */

const { AsyncObject, ReadWriteScheduler } = require('async-task-schedulers');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');
const User = require('./models/user');
const CropRelationship = require('./models/crop-relationship');
const Crop = require('./models/crop');
const Location = require('./models/location');
const validateUser = require('../shared/validation/userValidation');
const validateCredentials = require('../shared/validation/loginValidation');
const { Combinations } = require('../shared/combinations.js');

/**
 * Base class for exceptions that are thrown by Processor.
 * 
 * @extends Error
 */
class ProcessorException extends Error {
	/**
	 * @param {Number} httpStatusCode
	 */
	constructor(httpStatusCode) {
		super();
		this.httpStatusCode = httpStatusCode;
	}
}

const VALIDATION_EXCEPTION = new ProcessorException(400);
const AUTHENTICATION_EXCEPTION = new ProcessorException(401);
const AUTHORIZATION_EXCEPTION = new ProcessorException(403);

/**
 * Asynchronous object that lets only compatible method calls to run at the
 * same time. Principle is that each write operation is isolated from all
 * other operations.
 * 
 * This object does all database access and server side calculations. Clients
 * talk with this object through the HTTP API.
 *
 * @extends AsyncObject
 */
class Processor extends AsyncObject {
	constructor() {
		super();

		this.registerScheduler(this.getDocuments, this.scheduleRead);
		this.registerScheduler(this.getDocument, this.scheduleRead);
		this.registerScheduler(this.getAuthorizedDocuments, this.scheduleRead);
		this.registerScheduler(this.getAuthorizedDocument, this.scheduleRead);
		this.registerScheduler(this.getAuthenticatedUser, this.scheduleRead);
		this.registerScheduler(this.getAllDocuments, this.scheduleRead);
		this.registerScheduler(this.getCropsByName, this.scheduleRead);
		this.registerScheduler(this.getCropGroups, this.scheduleRead);
		this.registerScheduler(this.getCompatibleCrops, this.scheduleRead);
		this.registerScheduler(this.login, this.scheduleRead);

		this.registerScheduler(this.updateDocument, this.scheduleWrite);
		this.registerScheduler(this.updateAuthorizedDocument, this.scheduleWrite);
		this.registerScheduler(this.saveDocument, this.scheduleWrite);
		this.registerScheduler(this.saveAuthorizedDocument, this.scheduleWrite);
		this.registerScheduler(this.deleteDocument, this.scheduleWrite);
		this.registerScheduler(this.deleteAuthorizedDocument, this.scheduleWrite);

		this.scheduler = new ReadWriteScheduler();
		this.scheduler.activate();
	}

	/**
	 * Schedule a read operation that can run parallel with other read
	 * operations.
	 * 
	 * @param {AsyncFunction} method
	 * @param {Object[]} parameters
	 * @return {Task}
	 */
	scheduleRead(method, ...parameters) {
		return this.scheduler.pushRead(this, method, ...parameters);
	}

	/**
	 * Schedule a write operation that will block all other operations.
	 * 
	 * @param {AsyncFunction} method
	 * @param {Object[]} parameters
	 * @return {Task}
	 */
	scheduleWrite(method, ...parameters) {
		return this.scheduler.pushWrite(this, method, ...parameters);
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
	 * Get a set of documents.
	 * 
	 * @param {Model} model Document type
	 * @param {String[]} ids Document IDs
	 * @return {Document[]} Array of documents or null if one document was not
	 *                      found.
	 */
	async getDocuments(model, ids) {
		this.validate(ids);

		const path = model == CropRelationship ? 'crop0 crop1' : '';
		const documents = await model
			.find({ _id: { $in: ids } })
			.populate(path)
			.exec();

		const foundIds = documents.map(document => document._id.toString());
		const allFound = ids.every(id => foundIds.includes(id));

		return allFound ? documents : null;
	}

	/**
	 * Get one document.
	 * 
	 * @param {Model} model Document type
	 * @param {String} id Document ID
	 * @return {Document} Document or null if not found
	 */
	async getDocument(model, id) {
		const documents = await this.getDocumentsUnmanaged(model, [id]);
		return documents ? documents[0] : null;
	}

	/**
	 * Get a set of authorized documents.
	 * 
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {String[]} ids
	 * @return {Document[]}
	 */
	async getAuthorizedDocuments(currentUser, model, ids) {
		const documents = await this.getDocumentsUnmanaged(model, ids);
		if (!documents) {
			return null;
		}

		this.authorize(currentUser, documents);

		return documents;
	}

	/**
	 * Get one authorized document.
	 * 
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {String} id
	 * @return {Document} Document, or null if not authorized
	 */
	async getAuthorizedDocument(currentUser, model, id) {
		const documents = await this.getAuthorizedDocumentsUnmanaged(
			currentUser,
			model,
			[id]
		);
		return documents ? documents[0] : null;
	}

	/**
	 * Assign an update to the given document and save the updated document.
	 *
	 * @param {Document} document
	 * @param {Object} update Update for the document
	 * @return {Document}
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
	 * Save document to database.
	 * 
	 * @param {Model} model
	 * @param {Object} object
	 * @return {Document}
	 */
	async saveDocument(model, object) {
		if (model == CropRelationship) {
			const cropIds = [object.crop0, object.crop1];
			const crops = await this.getDocumentsUnmanaged(Crop, cropIds);
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
	 * Save authorized document to database.
	 * 
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {Object} object
	 * @return {Document}
	 */
	async saveAuthorizedDocument(currentUser, model, object) {
		this.authorize(currentUser, [object]);
		const document = await this.saveDocumentUnmanaged(model, object);
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
		const document = await this.getDocumentUnmanaged(model, id);
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
		const document = await this.getAuthorizedDocumentUnmanaged(
			currentUser,
			model,
			id
		);
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
		const document = await this.getDocumentUnmanaged(model, id);
		await this.deleteDocumentInternal(model, document);
	}

	/**
	 * Delete the given authorized document.
	 *
	 * @param {Document} currentUser
	 * @param {Model} model
	 * @param {String} id
	 */
	async deleteAuthorizedDocument(currentUser, model, id) {
		const document = await this.getAuthorizedDocumentUnmanaged(
			currentUser,
			model,
			id
		);
		await this.deleteDocumentInternal(model, document);
	}

	/**
	 * Get User document matching the authorization token.
	 * 
	 * @param {String} token
	 * @return {Document}
	 */
	async getAuthenticatedUser(token) {
		let userInfo;
		try {
			userInfo = jwt.verify(token, JWT_SECRET);
		} catch (exception) {
			throw AUTHENTICATION_EXCEPTION;
		}

		const document = await this.getDocumentUnmanaged(User, userInfo.id);
		document.populate('locations');
		return document;
	}

	/**
	 * Get all documents of the given type.
	 * 
	 * @param {Model} model Document type
	 * @return {Document[]}
	 */
	async getAllDocuments(model) {
		return await model.find({}).exec();
	}

	/**
	 * Given all compatible combinations, get non-overlapping crop groups,
	 * and update the Combinations object by removing the crops of these
	 * groups.
	 * 
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
	 * For each crop find all crop relationships and assign them to the
	 * document.
	 * 
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
	 * Assign isCompatible() for the given Crop documents for use with the
	 * Combinations class.
	 * 
	 * @param {Crop[]} crops
	 * @param {Function} isCompatibleFunction
	 */
	static assignIsCompatible(crops, isCompatibleFunction) {
		crops.forEach(crop => {
			crop.isCompatible = isCompatibleFunction;
		});
	}

	/**
	 * Divide the given crops into groups of compatible crops.
	 * 
	 * @param {String[]} cropIds
	 * @return {Array}
	 */
	async getCropGroups(cropIds) {
		let crops = await this.getDocumentsUnmanaged(Crop, cropIds);
		if (!crops) {
			throw VALIDATION_EXCEPTION;
		}

		await this.assignRelationships(crops);

		let groups = [];

		// Create groups of companion crops
		Processor.assignIsCompatible(crops, isCompanion);
		const companionCombinations = new Combinations(crops);
		groups = groups.concat(
			Processor.removeCropGroupsFromCombinations(
				companionCombinations,
				companionCombinations.getLargestCombinationSize()
			)
		);

		// From the remaining crops, create small groups of neutral crops
		const remainingCrops = companionCombinations.getElements();
		Processor.assignIsCompatible(remainingCrops, isNeutral);
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
	 * Get other crops that are compatible with the given set of crops.
	 * The crops in the sum set are all compatible.
	 * 
	 * @param {String[]} cropIds
	 * @return {Array}
	 */
	async getCompatibleCrops(cropIds) {
		let allCrops = await this.getAllDocumentsUnmanaged(Crop);
		await this.assignRelationships(allCrops);
		Processor.assignIsCompatible(allCrops, isCompanion);
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
	 * Convert a string into regex-friendly format, escaping all regex
	 * special characters.
	 * 
	 * @param {String} text String to convert
	 * @return {String} Escaped string
	 */
	static escapeRegEx(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}

	/**
	 * Get crops whose name matches the given regular expression.
	 * 
	 * @param {String} regex
	 * @param {Number} index
	 * @param {Number} length
	 * @return {Crop[]}
	 */
	async getCropsByName(regex, index, length) {
		const crops = await Crop.find()
			.byName(Processor.escapeRegEx(regex))
			.exec();
		return length === 0
			? crops.slice(index)
			: crops.slice(index, index + length);
	}

	/**
	 * Try to login with the given credentials.
	 * 
	 * @param {Object} credentials
	 * @return {Object} Authorization token
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
			JWT_SECRET
		);
		return { token };
	}
}

/**
 * Implements isCompatible() for Crop Combinations. Check if the given
 * other crop is compatible.
 * 
 * @param {Crop} crop
 * @return {Boolean}
 */
function isCompanion(crop) {
	return this.relationships.some(
		(relationship) =>
			(relationship.containsCrop(crop) && (relationship.compatibility > 0))
	);
}

/**
 * Implements isCompatible() for Crop Combinations. Check if the given
 * other crop is neutral but not incompatible.
 * 
 * @param {Crop} crop
 * @return {Boolean}
 */
function isNeutral(crop) {
	return this.relationships.some(
		(relationship) =>
			!relationship.containsCrop(crop) ||
			(relationship.containsCrop(crop) && (relationship.compatibility == 0))
	);
}

module.exports = {
	Processor,
	VALIDATION_EXCEPTION,
	AUTHENTICATION_EXCEPTION,
	AUTHORIZATION_EXCEPTION
};
