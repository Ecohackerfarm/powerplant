/**
 * @namespace cli
 * @memberof cli
 */

const PouchDB = require('pouchdb');
const practicalplants = require('../db/practicalplants.js');
const { plants, companions } = require('../db/companions.js');
const { HTTP_SERVER_PORT, HTTP_SERVER_HOST } = require('../secrets.js');
const { getHttpServerUrl, getPouchDatabaseUrl } = require('../shared/utils.js');

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

async function pouchMigrate() {
	try {
		let remote = new PouchDB(getPouchDatabaseUrl('crops'));

		console.log(await remote.info());

		await remote.destroy();
		remote = new PouchDB(getPouchDatabaseUrl('crops'));

		console.log(await remote.info());

		const crops = readCrops();
		const documents = await remote.bulkDocs(crops);
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

	commands[nonOptionArguments[0]]();
}
