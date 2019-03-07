/**
 * @namespace processor
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');
const User = require('./models/user');
const CropRelationship = require('./models/crop-relationship');
const Crop = require('./models/crop');
const Location = require('./models/location');
const Version = require('./models/version');
const validateUser = require('../shared/validation/userValidation');
const validateCredentials = require('../shared/validation/loginValidation');
const { Combinations } = require('../shared/combinations.js');
const { debug } = require('./utils.js');

/**
 * Base class for exceptions that are thrown on the transaction level.
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
 * Validate the given document IDs.
 *
 * @param {String[]} ids
 */
function validate(ids) {
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
function authorize(currentUser, documents) {
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
 * @param {Object} session Session object
 * @param {Model} model Document type
 * @param {String[]} ids Document IDs
 * @return {Document[]} Array of documents or null if one document was not
 *                      found.
 */
async function getDocuments(session, model, ids) {
	validate(ids);
	
	let path;
	if (model == CropRelationship) {
		path = 'crop0 crop1';
	} else if (model == Crop) {
		path = 'tags';
	} else {
		path = '';
	}
	
	const documents = await model.find({ _id: { $in: ids } }).session(session).populate(path).exec();

	const foundIds = documents.map(document => document._id.toString());
	const allFound = ids.every(id => foundIds.includes(id));

	return allFound ? documents : null;
}

/**
 * Get one document.
 *
 * @param {Object} session
 * @param {Model} model Document type
 * @param {String} id Document ID
 * @return {Document} Document or null if not found
 */
async function getDocument(session, model, id) {
	const documents = await getDocuments(session, model, [id]);
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
async function getAuthorizedDocuments(session, currentUser, model, ids) {
	const documents = await getDocuments(session, model, ids);
	if (!documents) {
		return null;
	}

	authorize(currentUser, documents);

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
async function getAuthorizedDocument(session, currentUser, model, id) {
	const documents = await getAuthorizedDocuments(
		session,
		currentUser,
		model,
		[id]
	);
	return documents ? documents[0] : null;
}

/**
 * Assign an update to the given document and save the updated document.
 *
 * @param {Object} session
 * @param {Model} model
 * @param {Document} document
 * @param {Object} update Update for the document
 * @return {Document}
 */
async function updateDocumentInternal(session, model, document, update) {
	if (!document) {
		return null;
	}

	delete update._id; // Don't try to update ID
	Object.assign(document, update);

	try {
		await document.save({ session });
	} catch (exception) {
		if (exception instanceof mongoose.Error.ValidationError) {
			debug(exception);
			throw VALIDATION_EXCEPTION;
		} else {
			throw exception;
		}
	}

	if (model == Crop) {
		await incrementCropsVersion(session);
	} else if (model == CropRelationship) {
		await incrementCropRelationshipsVersion(session);
	}

	return document;
}

/**
 * Save document to database.
 *
 * @param {Object} session
 * @param {Model} model
 * @param {Object} object
 * @return {Document}
 */
async function saveDocument(session, model, object) {
	if (model == CropRelationship) {
		const cropIds = [object.crop0, object.crop1];
		const crops = await getDocuments(session, Crop, cropIds);
		if (/*(cropIds[0] == cropIds[1]) ||*/ !crops) {
			throw VALIDATION_EXCEPTION;
		}

		const relationships = await CropRelationship.find().session(session)
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
	document = await updateDocumentInternal(session, model, document, object);

	if (model == User) {
		delete document.password;
	}

	return document;
}

/**
 * Save authorized document to database.
 *
 * @param {Object} session
 * @param {Document} currentUser
 * @param {Model} model
 * @param {Object} object
 * @return {Document}
 */
async function saveAuthorizedDocument(session, currentUser, model, object) {
	authorize(currentUser, [object]);
	const document = await saveDocument(session, model, object);
	if (!document) {
		return null;
	}

	if (model == Location) {
		currentUser.locations.push(document);
		await currentUser.save({ session });
	}

	return document;
}

/**
 * Update the given document.
 *
 * @param {Object} session
 * @param {Model} model
 * @param {String} id Document ID
 * @param {Object} update Update for the document
 * @return {Document} Updated document
 */
async function updateDocument(session, model, id, update) {
	const document = await getDocument(session, model, id);
	return await updateDocumentInternal(session, model, document, update);
}

/**
 * Update the given authorized document.
 *
 * @param {Object} session
 * @param {Document} currentUser
 * @param {Model} model
 * @param {String} id Document ID
 * @param {Object} update Update for the document
 * @return {Document} Updated document
 */
async function updateAuthorizedDocument(session, currentUser, model, id, update) {
	const document = await getAuthorizedDocument(
		session,
		currentUser,
		model,
		id
	);
	return await updateDocumentInternal(session, model, document, update);
}

/**
 * Delete the given document.
 *
 * @param {Object} session
 * @param {Model} model
 * @param {Document} document
 */
async function deleteDocumentInternal(session, model, document) {
	if (model == Crop) {
		const result = await CropRelationship.find().session(session)
			.byCrop(document._id)
			.remove();
		if (result.deletedCount > 0) {
			await incrementCropRelationshipsVersion(session);
		}
		
		await incrementCropsVersion(session);
	} else if (model == CropRelationship) {
		await incrementCropRelationshipsVersion(session);
	}

	await document.remove({ session });
}

/**
 * Delete the given document.
 *
 * @param {Object} session
 * @param {Model} model
 * @param {String} id
 */
async function deleteDocument(session, model, id) {
	const document = await getDocument(session, model, id);
	await deleteDocumentInternal(session, model, document);
}

/**
 * Delete the given authorized document.
 *
 * @param {Document} currentUser
 * @param {Model} model
 * @param {String} id
 */
async function deleteAuthorizedDocument(session, currentUser, model, id) {
	const document = await getAuthorizedDocument(
		session,
		currentUser,
		model,
		id
	);
	await deleteDocumentInternal(session, model, document);
}

/**
 * Get User document matching the authorization token.
 *
 * @param {Object] session
 * @param {String} token
 * @return {Document}
 */
async function getAuthenticatedUser(session, token) {
	let userInfo;
	try {
		userInfo = jwt.verify(token, JWT_SECRET);
	} catch (exception) {
		throw AUTHENTICATION_EXCEPTION;
	}

	const document = await getDocument(session, User, userInfo.id);
	await document.populate('locations').execPopulate();
	return document;
}

/**
 * Get all documents of the given type.
 *
 * @param {Object} session
 * @param {Model} model Document type
 * @return {Document[]}
 */
async function getAllDocuments(session, model) {
	return await model.find({}).session(session).exec();
}

/**
 * Convert a string into regex-friendly format, escaping all regex
 * special characters.
 *
 * @param {String} text String to convert
 * @return {String} Escaped string
 */
function escapeRegEx(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Get crops whose name matches the given regular expression.
 *
 * @param {Object} session
 * @param {String} regex
 * @param {Number} index
 * @param {Number} length
 */
async function getCropsByName(session, regex, index, length) {
	const crops = await Crop.find().session(session).byName(escapeRegEx(regex)).populate('tags').exec();
	return length === 0
		? crops.slice(index)
		: crops.slice(index, index + length);
}

/**
 * @param {Object} session
 * @param {Object} clientVersion
 */
async function getUpdates(session, clientVersion) {
	const serverVersion = await getVersion(session);

	const updates = {};
	if (await needsUpdate(session, clientVersion, serverVersion, 'crops')) {
		const crops = await Crop.find().session(session).byName(escapeRegEx('')).populate('tags').exec();
		const trimmedCrops = crops.map(crop => ({
			_id: crop._id,
			commonName: crop.commonName,
			binomialName: crop.binomialName,
			tags: crop.tags
		}));
		
		updates.crops = {
			version: serverVersion.crops,
			data: trimmedCrops
		};
	}
	if (await needsUpdate(session, clientVersion, serverVersion, 'cropRelationships')) {
		const cropRelationships = await getAllDocuments(session, CropRelationship);
		updates.cropRelationships = {
			version: serverVersion.cropRelationships,
			data: cropRelationships
		};
	}
	
	return updates;
}

/**
 * @param {Version} clientVersion
 * @param {Version} serverVersion
 * @param {String} target
 * @return {Boolean}
 */
async function needsUpdate(session, clientVersion, serverVersion, target) {
	const forceUpdate = serverVersion[target] === 0;
	
	if (forceUpdate) {
		await incrementTargetVersion(session, serverVersion, target);
	}
	
	return forceUpdate || (clientVersion[target] !== serverVersion[target]);
}

/**
 * @param {Object} session
 */
async function incrementCropRelationshipsVersion(session) {
	await incrementTargetVersion(session, await getVersion(session), 'cropRelationships');
}

/**
 * @param {Object} session
 */
async function incrementCropsVersion(session) {
	await incrementTargetVersion(session, await getVersion(session), 'crops');
}

/**
 * @param {Object} session
 * @param {Version} version
 * @param {String} target
 */
async function incrementTargetVersion(session, version, target) {
	version[target]++;
	await version.save({ session });
}

/**
 * @param {Object} session
 * @return {Version}
 */
async function getVersion(session) {
	return (await Version.find().session(session))[0];
}

/**
 * Try to login with the given credentials.
 *
 * @param {Object} session
 * @param {Object} credentials
 * @return {Object} Authorization token
 */
async function login(session, credentials) {
	// First, make sure credentials pass validation
	const { errors, isValid } = validateCredentials(credentials);
	if (!isValid) {
		throw AUTHENTICATION_EXCEPTION;
	}

	// Next make sure the user exists
	const user = await User.find().session(session)
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

module.exports = {
	getDocument,
	getAuthorizedDocument,
	saveDocument,
	saveAuthorizedDocument,
	updateDocument,
	updateAuthorizedDocument,
	deleteDocument,
	deleteAuthorizedDocument,
	getAuthenticatedUser,
	getAllDocuments,
	getCropsByName,
	getUpdates,
	login,

	VALIDATION_EXCEPTION,
	AUTHORIZATION_EXCEPTION,
	AUTHENTICATION_EXCEPTION
};
