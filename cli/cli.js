/**
 * @namespace cli
 * @memberof cli
 */

const mysql = require('mysql2/promise');
const { plants, companions } = require('../db/companions.js');
const { ApiClient } = require('./api-client.js');
const { PP_PORT, API_HOST } = require('../secrets.js');

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
	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	const model = nonOptionArguments[1];
	const ids = nonOptionArguments.slice(2);

	let documents;
	switch (model) {
		case 'crop': {
			documents = await client.getCrops(ids);
			break;
		}
		case 'crop-relationship': {
			documents = await client.getCropRelationships(ids);
			break;
		}
		case 'user': {
			documents = await client.getUsers(ids);
			break;
		}
		default:
		break;
	}

	documents.forEach(document => {
		console.log(document);
	});
}

/**
 * Add documents.
 */
async function doAdd() {
	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	const model = nonOptionArguments[1];
	const documents = parseOptionArray('document');

	switch (model) {
		case 'crop': {
			await client.addCrops(documents);
			break;
		}
		case 'crop-relationship': {
			await client.addCropRelationships(documents);
			break;
		}
		case 'user': {
			await client.addUsers(documents);
			break;
		}
		default:
		break;
	}

	console.log(documents);
}

/**
 * Update documents.
 */
async function doUpdate() {
	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	const model = nonOptionArguments[1];
	const ids = nonOptionArguments.slice(2);
	const documents = parseOptionArray('document');

	const idMapDocument = {};
	ids.forEach((id, index) => {
		idMapDocument[id] = documents[index];
	});

	switch (model) {
		case 'crop': {
			await client.setCrops(idMapDocument);
			break;
		}
		case 'crop-relationship': {
			await client.getCropRelationships(idMapDocument);
			break;
		}
		case 'user': {
			await client.getUsers(idMapDocument);
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
	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	const model = nonOptionArguments[1];
	const ids = nonOptionArguments.slice(2);

	switch (model) {
		case 'crop': {
			if (ids.length > 0) {
				await client.removeCrops(ids);
			} else {
				await client.removeAllCrops();
			}
			break;
		}
		case 'crop-relationship': {
			if (ids.length > 0) {
				await client.removeCropRelationships(ids);
			} else {
				await client.removeAllCropRelationships();
			}
			break;
		}
		case 'user': {
			await client.removeUsers(ids);
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
	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	const name = parseOption('name');
	const index = parseOption('index');
	const length = parseOption('length');

	const crops = await client.getCropsByName(name, index, length);

	log(crops);
}

/**
 * Get crop groups.
 */
async function doGetCropGroups() {
	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	const crops = parseOptionArray('crop');

	const groups = await client.getCropGroups(crops);
	log(groups);
}

/**
 * Get compatible crops.
 */
async function doGetCompatibleCrops() {
	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	const ids = parseOptionArray('crop');

	const crops = await client.getCompatibleCrops(ids);
	log(crops);
}

/**
 * Push the PFAF (Plants For A Future, http://www.pfaf.org) database to
 * powerplant server.
 */
async function pushPfaf() {
	let mysqlConfig = {
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'password',
		database: 'permaflorae'
	};

	Object.assign(mysqlConfig, parseOption('mysqlConfig'));
	const connection = await mysql.createConnection(mysqlConfig);
	const [rows, fields] = await connection.query(
		'select `common name`,`latin name` = require(`species database`'
	);
	connection.end();

	const crops = [];
	rows.forEach(row => {
		debug(row);
		const crop = {
			commonName: row['common name'],
			binomialName: row['latin name']
		};
		crops.push(crop);
	});

	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);
	await client.addCrops(crops);
}

/**
 * Push the companion plant database to powerplant server.
 */
async function pushCompanions() {
	const crops = [];
	const plantNameToCrop = {};
	plants.forEach(plant => {
		let crop = {
			commonName: plant,
			binomialName: plant
		};
		crops.push(crop);
		plantNameToCrop[plant] = crop;
	});

	const client = new ApiClient(powerplantConfig.host, powerplantConfig.port);

	log(await client.addCrops(crops));

	const relationships = companions.map(companion => ({
		crop0: plantNameToCrop[companion.plant0]._id,
		crop1: plantNameToCrop[companion.plant1]._id,
		compatibility: ((companion.companion == 1) ? 1 : -1)
	}));

	log(await client.addCropRelationships(relationships));
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
	'get-crop-groups': doGetCropGroups,
	'get-compatible-crops': doGetCompatibleCrops,
	'push-pfaf': pushPfaf,
	'push-companions': pushCompanions
};

const commandLineArguments = process.argv.slice(2);
const nonOptionArguments = getNonOptionArguments();
const optionArguments = getOptionArguments();

if (nonOptionArguments.length > 0) {
	verbose = parseOption('verbose');
	Object.assign(powerplantConfig, parseOption('powerplantConfig'));

	commands[nonOptionArguments[0]]();
}
