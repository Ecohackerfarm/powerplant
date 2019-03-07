/**
 * @namespace cli
 * @memberof cli
 */

const mongoose = require('mongoose');
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
const { PP_PORT, API_HOST } = require('../secrets.js');
const { getDatabaseURL } = require('../server/utils.js');
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
 * Push the companion plant database to powerplant server.
 */
async function pushCompanions() {
	const crops = practicalplants.readCrops();
	
	const plantNameToCrop = {};
	crops.forEach(crop => {
		crop.tags = [];
		plantNameToCrop[crop.binomialName] = crop;
	});
	
	plants.forEach(plant => {
		if (plantNameToCrop[plant] === undefined) {
			log(plant + ' from companion db does not exist in practicalplants db');
		}
	});
	
	for (let index = 0; index < crops.length; index++) {
		const response = await addCrop({ document: crops[index] });
		Object.assign(crops[index], response.data);
	}

	const relationships = companions.map(companion => ({
		crop0: plantNameToCrop[companion.plant0]._id,
		crop1: plantNameToCrop[companion.plant1]._id,
		compatibility: ((companion.companion == 1) ? 1 : -1)
	}));

	for (let index = 0; index < relationships.length; index++) {
		await addCropRelationship({ document: relationships[index] });
	}
}

/**
 * 
 */
async function dbResetVersion() {
	const mongooseOptions = {
		replicaSet: 'rs',
		useNewUrlParser: true
	};
	mongoose.connect(getDatabaseURL(), mongooseOptions);
	
	await Version.createCollection();
	await Version.deleteMany({}).exec();
	const document = new Version();
	document.crops = 0; // Force update to clients
	document.cropRelationships = 0; // Force update to clients
	await document.save();
	console.log('Reset version information');
}

/*
 * Global options
 */
let verbose = false;
let powerplantConfig = {
	host: API_HOST,
	port: PP_PORT
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
	'push-companions': pushCompanions,
	'db-reset-version': dbResetVersion,
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
