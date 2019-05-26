/**
 * @namespace cli
 * @memberof cli
 */

const mongoose = require('mongoose');
const PouchDB = require('pouchdb');
const {
	setBaseUrl,
	getCropsByName,
	getUpdates,
	getCrops,
	getCropRelationships,
	getCropTags,
	getUsers,
	addCrop,
	addCropRelationship,
	addCrops,
	addCropRelationships,
	addCropTags,
	addUsers,
	setCrops,
	setCropRelationships,
	setCropTags,
	setUsers,
	removeCrops,
	removeCropRelationships,
	removeCropTags,
	removeUsers,
	removeAllCrops,
	removeAllCropRelationships
} = require('../shared/api-client.js');
const practicalplants = require('../db/practicalplants.js');
const { plants, companions } = require('../db/companions.js');
const { HTTP_SERVER_PORT, HTTP_SERVER_HOST } = require('../secrets.js');
const { getDatabaseUrl, getHttpServerUrl, getPouchDatabaseUrl } = require('../shared/utils.js');
const Crop = require('../server/models/crop.js');
const CropRelationship = require('../server/models/crop-relationship.js');
const CropTag = require('../server/models/crop-tag.js');
const Version = require('../server/models/version.js');

/**
 * Print a message to console.
 *
 * @param {String} message
 */
function log(message) {
	console.log(message);
}

/**
 * Print a message only if in verbose mode.
 *
 * @param {String} message
 */
function debug(message) {
	if (verbose) {
		log(message);
	}
}

/**
 * @return {Object} Value of the option argument
 */
function parseOptionValue(argument, argumentWithoutValue) {
	const valueString = argument.slice(argumentWithoutValue.length);
	const valueStringLowerCase = valueString.toLowerCase();

	if (valueStringLowerCase === 'true' || valueStringLowerCase === 'false') {
		return Boolean(valueStringLowerCase);
	}

	return valueString.includes(':')
		? eval('({' + valueString + '})')
		: eval("('" + valueString + "')");
}

/**
 * Find a command line option either in the form '--optionName=key:value...' or
 * '--optionName=value', and return either an object or a value.
 *
 * @param {String} optionName
 * @return {Object}
 */
function parseOption(optionName) {
	const optionStringWithoutValue = '--' + optionName + '=';
	const option = optionArguments.find(option =>
		option.startsWith(optionStringWithoutValue)
	);

	return option ? parseOptionValue(option, optionStringWithoutValue) : null;
}

/**
 * Parse all command line options with the given name, and return an array of
 * values.
 *
 * @param {String} optionName
 * @return {Object[]}
 */
function parseOptionArray(optionName) {
	const optionStringWithoutValue = '--' + optionName + '=';
	const options = optionArguments.filter(option =>
		option.startsWith(optionStringWithoutValue)
	);

	return options.map(option =>
		parseOptionValue(option, optionStringWithoutValue)
	);
}

/**
 * @return {String[]} Non-option command line arguments
 */
function getNonOptionArguments() {
	return commandLineArguments.filter(argument => !argument.startsWith('--'));
}

/**
 * @return {String[]} Option arguments
 */
function getOptionArguments() {
	const nonOptionArguments = getNonOptionArguments();
	return commandLineArguments.filter(
		argument => !nonOptionArguments.includes(argument)
	);
}

/**
 * Show documents.
 */
async function doShow() {
	const model = nonOptionArguments[1];
	const ids = nonOptionArguments.slice(2);
	const params = { ids: ids };

	let responses;
	switch (model) {
		case 'crop': {
			responses = await getCrops(params);
			break;
		}
		case 'crop-relationship': {
			responses = await getCropRelationships(params);
			break;
		}
		case 'crop-tag': {
			responses = await getCropTags(params);
			break;
		}
		case 'user': {
			responses = await getUsers(params);
			break;
		}
		default:
		break;
	}

	responses.forEach(response => {
		console.log(response.data);
	});
}

/**
 * Add documents.
 */
async function doAdd() {
	const model = nonOptionArguments[1];
	const documents = parseOptionArray('document');
	const params = { documents: documents };

	let createdDocuments;
	switch (model) {
		case 'crop': {
			createdDocuments = await addCrops(params);
			break;
		}
		case 'crop-relationship': {
			createdDocuments = await addCropRelationships(params);
			break;
		}
		case 'crop-tag': {
			createdDocuments = await addCropTags(params);
			break;
		}
		case 'user': {
			createdDocuments = await addUsers(params);
			break;
		}
		default:
		break;
	}

	console.log(createdDocuments.map(document => document.data));
}

/**
 * Update documents.
 */
async function doUpdate() {
	const model = nonOptionArguments[1];
	const ids = nonOptionArguments.slice(2);
	const documents = parseOptionArray('document');
	const params = { documents: documents, ids: ids };

	switch (model) {
		case 'crop': {
			await setCrops(params);
			break;
		}
		case 'crop-relationship': {
			await setCropRelationships(params);
			break;
		}
		case 'crop-tag': {
			await setCropTags(params);
			break;
		}
		case 'user': {
			await setUsers(params);
			break;
		}
		default:
		break;
	}
}

/**
 * Remove documents.
 */
async function doRemove() {
	const model = nonOptionArguments[1];
	const ids = nonOptionArguments.slice(2);
	const params = { ids: ids };

	switch (model) {
		case 'crop': {
			if (ids.length > 0) {
				await removeCrops(params);
			} else {
				await removeAllCrops();
			}
			break;
		}
		case 'crop-relationship': {
			if (ids.length > 0) {
				await removeCropRelationships(params);
			} else {
				await removeAllCropRelationships();
			}
			break;
		}
		case 'crop-tag': {
			await removeCropTags(params);
			break;
		}
		case 'user': {
			await removeUsers(params);
			break;
		}
		default:
		break;
	}
}

/**
 * Get crops by name.
 */
async function doGetCropsByName() {
	const name = parseOption('name');
	const index = parseOption('index');
	const length = parseOption('length');

	const crops = await getCropsByName({ name: name, index: index, length: length });

	log(crops.data);
}

/**
 * Get updates from server.
 */
async function doGetUpdates() {
	const crops = parseInt(parseOption('crops'), 10);
	
	const version = {
		crops: crops
	};
	
	const updates = await getUpdates(version);
	
	log(updates);
}

/**
 * Migrate initial database through HTTP for stress testing the powerplant
 * server. The migration process may not be complete here, if you just want
 * to cleanly migrate the database, use the 'db-migrate' command.
 */
async function migrate() {
	const crops = practicalplants.readCrops();
	
	const plantNameToCrop = {};
	crops.forEach(crop => {
		crop.tags = [];
		plantNameToCrop[crop.binomialName] = crop;
	});

	checkCompanionDatabaseIntegrity(plantNameToCrop);
	
	for (let index = 0; index < crops.length; index++) {
		const response = await addCrop({ document: crops[index] });
		Object.assign(crops[index], response.data);
	}

	const relationships = convertCompanionDatabaseToCropRelationships(plantNameToCrop);

	for (let index = 0; index < relationships.length; index++) {
		await addCropRelationship({ document: relationships[index] });
	}
}

/**
 * Migrate the initial database directly to MongoDB.
 */
async function dbMigrate() {
	openMongooseConnection();

	/*
	 * Drop old collections and create new empty ones.
	 */
	await dropCollection('croprelationships');
	await dropCollection('croptags');
	await dropCollection('crops');
	await dropCollection('versions');

	await Crop.createCollection();
	await CropRelationship.createCollection();
	await CropTag.createCollection();
	await Version.createCollection();

	/*
	 * Migrate crops.
	 */
	const crops = readCrops();
	const cropDocuments = await Crop.insertMany(crops);

	/*
	 * Migrate crop relationships.
	 */
	const binomialNameToCropDocument = {};
	cropDocuments.forEach(crop => {
		binomialNameToCropDocument[crop.binomialName] = crop;
	});

	checkCompanionDatabaseIntegrity(binomialNameToCropDocument);

	const relationships = convertCompanionDatabaseToCropRelationships(binomialNameToCropDocument);

	const cropRelationshipDocuments = await CropRelationship.insertMany(relationships);

	/*
	 * Reset version information.
	 */
	await resetVersionCollection();

	mongoose.connection.close();
}

async function pouchMigrate() {
	try {
		let remote = new PouchDB(getPouchDatabaseUrl('crops'));

		console.log(await remote.info());

		await remote.destroy();
		remote = new PouchDB(getPouchDatabaseUrl('crops'));

		console.log(await remote.info());

		const crops = readCrops();
		const documents = await local.bulkDocs(crops);
		console.log(documents);
	} catch (exception) {
		console.log(exception);
	}
}

async function pouchSync() {
	try {
		let local = new PouchDB('crops-local');
		let remote = new PouchDB(getPouchDatabaseUrl('crops'));

		console.log(await remote.info());
		console.log(await local.info());

		console.log(await local.sync(remote));

		console.log(await remote.info());
		console.log(await local.info());
	} catch (exception) {
		console.log(exception);
	}
}

async function pouchClone() {
	let local = new PouchDB('crops-local');
	await local.destroy();

	await pouchSync();
}

async function pouchRemove() {
	const ids = nonOptionArguments.slice(1);

	const local = new PouchDB('crops-local');

	ids.forEach(async id => {
		try {
			console.log(await local.remove(await local.get(id)));
		} catch (exception) {
			console.log(exception);
		}
	});
}

async function pouchAdd() {
	const documents = parseOptionArray('document');

	const local = new PouchDB('crops-local');

	documents.forEach(async document => {
		try {
			console.log(await local.post(document));
		} catch (exception) {
			console.log(exception);
		}
	});
}

async function pouchUpdate() {
	const ids = nonOptionArguments.slice(1);
	const documents = parseOptionArray('document');

	const local = new PouchDB('crops-local');

	for (let index = 0; index < ids.length; index++) {
		const id = ids[index];
		const document = documents[index];

		console.log(document);

		try {
			const existing = await local.get(id);

			console.log(await local.put(Object.assign({}, existing, document, { _id: id, _rev: existing._rev })));
		} catch (exception) {
			console.log(exception);
		}
	}
}

async function pouchShow() {
	const ids = nonOptionArguments.slice(1);
	const revs = parseOptionArray('rev');

	const local = new PouchDB('crops-local');

	for (let index = 0; index < ids.length; index++) {
		const id = ids[index];
		const rev = (index < revs.length) ? revs[index] : null;

		let options = { revs: true };
		if (rev) {
			Object.assign(options, { rev: rev });
		}

		try {
			console.log(await local.get(id, options));
		} catch (exception) {
			console.log(exception);
		}
	}
}

async function pouchFind() {
	const search = nonOptionArguments[1];

	const local = new PouchDB('crops-local');

	try {
		const documents = (await local.allDocs({ include_docs: true })).rows.map(row => row.doc);
		documents.forEach(document => {
			if (document.binomialName.toLowerCase().includes(search) || (document.commonName && document.commonName.toLowerCase().includes(search))) {
				console.log(document);
			}
		});
	} catch (exception) {
		console.log(exception);
	}
}

function readCrops() {
	const crops = practicalplants.readCrops();

	crops.forEach(crop => {
		crop.tags = [];
	});

	return crops;
}

/**
 * Reset version information. This forces the server to send updates to
 * clients.
 */
async function dbResetVersion() {
	openMongooseConnection();

	await Version.createCollection();
	await resetVersionCollection();
	console.log('Reset version information');

	mongoose.connection.close();
}

/**
 *
 */
async function resetVersionCollection() {
	await Version.deleteMany({}).exec();
	const document = new Version();
	document.crops = 0; // Force update to clients
	document.cropRelationships = 0; // Force update to clients
	await document.save();
}

/**
 * @param {Object} binomialNameToCropDocument
 * @return {Object[]}
 */
function convertCompanionDatabaseToCropRelationships(binomialNameToCropDocument) {
	const relationships = companions.map(companion => ({
		crop0: binomialNameToCropDocument[companion.plant0]._id,
		crop1: binomialNameToCropDocument[companion.plant1]._id,
		compatibility: ((companion.companion == 1) ? 1 : -1)
	}));
	return relationships;
}

/**
 * @param {Object} binomialNameToCrop
 */
function checkCompanionDatabaseIntegrity(binomialNameToCrop) {
	plants.forEach(plant => {
		if (binomialNameToCrop[plant] === undefined) {
			log(plant + ' from companion db does not exist in practicalplants db');
		}
	});
}

/**
 * @param name
 */
async function dropCollection(name) {
	try {
		await mongoose.connection.dropCollection(name);
	} catch (exception) {
		// There'll be an exception if a collection doesn't exist.
	}
}

/**
 *
 */
function openMongooseConnection() {
	const mongooseOptions = {
		replicaSet: 'rs',
		useNewUrlParser: true
	};
	mongoose.connect(getDatabaseUrl(), mongooseOptions);
}

/*
 * Global options
 */
let verbose = false;
let powerplantConfig = {
	host: HTTP_SERVER_HOST,
	port: HTTP_SERVER_PORT
};

/*
 * First command line argument is the command, rest of the arguments are
 * options for the command.
 */
const commands = {
	remove: doRemove,
	add: doAdd,
	update: doUpdate,
	show: doShow,
	'get-crops-by-name': doGetCropsByName,
	'get-updates': doGetUpdates,
	'migrate': migrate,
	'db-migrate': dbMigrate,
	'db-reset-version': dbResetVersion,
	'pouch-migrate': pouchMigrate,
	'pouch-sync': pouchSync,
	'pouch-clone': pouchClone,
	'pouch-remove': pouchRemove,
	'pouch-add': pouchAdd,
	'pouch-update': pouchUpdate,
	'pouch-show': pouchShow,
	'pouch-find': pouchFind,
};

const commandLineArguments = process.argv.slice(2);
const nonOptionArguments = getNonOptionArguments();
const optionArguments = getOptionArguments();

if (nonOptionArguments.length > 0) {
	verbose = parseOption('verbose');
	Object.assign(powerplantConfig, parseOption('powerplantConfig'));

	setBaseUrl(powerplantConfig.host, powerplantConfig.port);
	commands[nonOptionArguments[0]]();
}
