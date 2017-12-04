import url from 'url';
import request from 'request-promise';
import mysql from 'mysql2/promise';
import firebase from 'firebase';
import { override, registerSignal, AsyncObject, Task, SchedulerTask, SerialScheduler, ParallelScheduler } from 'async-task-schedulers';

/**
 *
 */
class DocumentGetter extends AsyncObject {
	/**
	 * @param {String} modelPath
	 */
	constructor(modelPath) {
		super();
		
		this.modelPath = modelPath;
		this.documents = [];
		
		this.registerTaskParameters('getDocuments');
	}
	
	/**
	 * Schedule getDocument() calls to fetch all documents before doing the pushed
	 * getDocuments() task.
	 *
	 * @return {Scheduler}
	 */
	newScheduler() {
		const scheduler = new ParallelScheduler();
		override(scheduler, 'push', (originalPush) => {
			return function(task) {
				const fetchScheduler = new ParallelScheduler();
				const object = task.object;
				const ids = task.parameters[0];
				ids.forEach((id, index) => {
					fetchScheduler.push(new Task(object, object.getDocument, id, index));
				});
				
				const operationScheduler = new SerialScheduler();
				operationScheduler.push(new SchedulerTask(fetchScheduler));
				operationScheduler.push(task);
				
				originalPush(new SchedulerTask(operationScheduler));
			};
		});
		scheduler.activate();
		
		return scheduler;
	}
	
	/**
	 * @return {Task}
	 */
	getTaskClass() {
		return Task;
	}
	
	/**
	 * @param {String} id
	 * @param {Number} index
	 */
	async getDocument(id, index) {
		const requestOptions = {
			method: 'GET',
			uri: getApiUrl() + this.modelPath + '/' + id,
			json: true
		};
		this.documents[index] = await request(requestOptions);
	}
	
	/**
	 * @param {String[]} ids
	 */
	async getDocuments(ids) {
		return this.documents;
	}
}

/**
 *
 */
class DocumentRemover extends AsyncObject {
	/**
	 * @param {String} modelPath
	 */
	constructor(modelPath) {
		super();
		
		this.modelPath = modelPath;
		
		this.registerTaskParameters('removeDocument');
	}
	
	newScheduler() {
		const scheduler = new ParallelScheduler();
		scheduler.activate();
		
		return scheduler;
	}
	
	getTaskClass() {
		return Task;
	}
	
	/**
	 * @param {String} id
	 */
	async removeDocument(id) {
		const requestOptions = {
			method: 'DELETE',
			uri: getApiUrl() + this.modelPath + '/' + id,
			json: true
		};
		await request(requestOptions);
		
		this.onRemoved(id);
	}
	
	/**
	 * @param {String[]} ids
	 */
	removeDocuments(ids) {
		ids.forEach(id => {
			this.call('removeDocument', id);
		});
	}
	
	/**
	 * Called when a document has been successfully removed.
	 *
	 * @param {String} id
	 */
	onRemoved(id) {
	}
}

/**
 *
 */
class DocumentAdder extends AsyncObject {
	/**
	 * @param {String} modelPath
	 */
	constructor(modelPath) {
		super();
		
		this.modelPath = modelPath;
		
		this.registerTaskParameters('addDocument');
	}
	
	newScheduler() {
		const scheduler = new ParallelScheduler();
		scheduler.activate();
		
		return scheduler;
	}
	
	getTaskClass() {
		return Task;
	}
	
	/**
	 * @param {Object} object
	 */
	async addDocument(object) {
		const requestOptions = {
			method: 'POST',
			uri: getApiUrl() + this.modelPath,
			json: true,
			body: object
		};
		const response = await request(requestOptions);
		
		this.onAdded(response);
	}
	
	/**
	 * @param {Object[]} objects
	 */
	addDocuments(objects) {
		objects.forEach(object => {
			this.call('addDocument', object);
		});
	}
	
	/**
	 * Called with the added document that contains the ID.
	 *
	 * @param {Object} document
	 */
	onAdded(document) {
	}
}

/**
 *
 */
class DocumentUpdater extends AsyncObject {
	/**
	 * @param {String} modelPath
	 */
	constructor(modelPath) {
		super();
		
		this.modelPath = modelPath;
		
		this.registerTaskParameters('updateDocument');
	}
	
	newScheduler() {
		const scheduler = new ParallelScheduler();
		scheduler.activate();
		
		return scheduler;
	}
	
	getTaskClass() {
		return Task;
	}
	
	/**
	 * @param {Object} object
	 */
	async updateDocument(id, object) {
		const requestOptions = {
			method: 'PUT',
			uri: getApiUrl() + this.modelPath + '/' + id,
			json: true,
			body: object
		};
		const response = await request(requestOptions);
		
		this.onUpdated(id, response);
	}
	
	/**
	 * @param {String[]} ids
	 * @param {Object[]} objects
	 */
	updateDocuments(ids, objects) {
		ids.forEach((id, index) => {
			this.call('updateDocument', id, objects[index]);
		});
	}
	
	/**
	 * Called with the updadted document.
	 *
	 * @param {Object} document
	 */
	onUpdated(id, document) {
	}
}


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
	
	if ((valueStringLowerCase == 'true') || (valueStringLowerCase == 'false')) {
		return Boolean(valueStringLowerCase);
	}
	
	return valueString.includes(':')
		? eval('({' + valueString + '})') : eval('("' + valueString + '")');
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
	const option = optionArguments.find(option => option.startsWith(optionStringWithoutValue));
	
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
	const options = optionArguments.filter(option => option.startsWith(optionStringWithoutValue));
	
	return options.map(option => parseOptionValue(option, optionStringWithoutValue));
}

/**
 * @return {String[]} Non-option command line arguments
 */
function getNonOptionArguments() {
	return commandLineArguments.filter(argument => (!argument.startsWith('--')));
}

/**
 * @return {String[]} Option arguments
 */
function getOptionArguments() {
	const nonOptionArguments = getNonOptionArguments();
	return commandLineArguments.filter(argument => (!nonOptionArguments.includes(argument)));
}


/**
 * @return {String}
 */
function getApiUrl() {
	return 'http://' + powerplantConfig.host + ':' + powerplantConfig.port + '/api';
}

/**
 * @param {String} path
 * @param {Object} document
 */
async function pushDocument(path, document) {
	const httpOptions = {
		method: 'POST',
		uri: getApiUrl() + path,
		json: true,
		body: document
	};
	
	let response;
	try {
		response = await request(httpOptions);
	} catch (exception) {
		debug(exception);
		return null;
	}
	
	log('Pushed document ' + path + response._id);
	
	return response;
}

/**
 * Remove a document.
 *
 * @param {String} path
 * @param {String} id
 */
async function removeDocument(path, id) {
	const httpOptions = {
		method: 'DELETE',
		uri: getApiUrl() + path + id,
		json: true
	};
	
	try {
		await request(httpOptions);
	} catch (exception) {
		debug(exception);
		return;
	}
	
	log('Removed ' + nonOptionArguments[1] + ' ' + id);
}

/**
 *
 */
async function getAllOrganisms() {
	let all = [];
	let index = 0;
	const length = 50;
	
	for (;;) {
		const part = await getOrganismsByName('', index, length);
		
		all = all.concat(part);
		index += length;
		
		if (part.length < length) {
			break;
		}
	}
	
	return all;
}

/**
 * Remove all documents.
 *
 * @param {String} path
 */
async function removeDocuments(getAllDocumentsPath, path) {
	const httpOptions = {
		method: 'GET',
		uri: getApiUrl() + getAllDocumentsPath,
		json: true
	};

	let documents;
	try {
		if (getAllDocumentsPath.includes('get-organisms-by-name')) {
			documents = await getAllOrganisms();
		} else {
			documents = await request(httpOptions);
		}
	} catch (exception) {
		debug(exception);
		return;
	}
	debug(documents);
	
	const scheduler = new SerialScheduler();
	documents.forEach((document) => {
		scheduler.push(new Task(undefined, removeDocument, path, document._id));
	});
	scheduler.activate();
}

const modelNameToPath = {};
modelNameToPath['organism'] = '/organisms';
modelNameToPath['companionship'] = '/companionships';
modelNameToPath['location'] = '/locations';
modelNameToPath['user'] = '/users';

function getDocumentActionModelPath() {
	return modelNameToPath[nonOptionArguments[1]];
}

/**
 * Show documents.
 */
async function doShow() {
	const path = getDocumentActionModelPath();
	if (!path) {
		return;
	}
	
	const documents = await new DocumentGetter(path).call('getDocuments', nonOptionArguments.slice(2));
	
	documents.forEach(document => {
		console.log(document);
	});
}

/**
 * Add documents.
 */
async function doAdd() {
	const path = getDocumentActionModelPath();
	if (!path) {
		return;
	}
	
	const adder = new DocumentAdder(path);
	registerSignal(adder, 'onAdded', undefined, (document) => {
		console.log('Added ' + nonOptionArguments[1]);
		console.log(document);
	});
	
	adder.addDocuments(parseOptionArray('document'));
}

/**
 * Update documents.
 */
async function doUpdate() {
	const path = getDocumentActionModelPath();
	if (!path) {
		return;
	}
	
	const updater = new DocumentUpdater(path);
	registerSignal(updater, 'onUpdated', undefined, (id, document) => {
		console.log('Updated ' + nonOptionArguments[1] + ' ' + id);
		console.log(document);
	});
	
	updater.updateDocuments(nonOptionArguments.slice(2), parseOptionArray('document'));
}

/**
 * Remove documents.
 */
async function doRemove() {
	const path = getDocumentActionModelPath();
	if (!path) {
		return;
	}
	
	if (nonOptionArguments.length > 2) {
		const remover = new DocumentRemover(path);
		registerSignal(remover, 'onRemoved', undefined, (id) => {
			console.log('Removed ' + nonOptionArguments[1] + ' ' + id);
		});
		
		remover.removeDocuments(nonOptionArguments.slice(2));
	} else {
		switch (nonOptionArguments[1]) {
		case 'organism':
			await removeDocuments('/get-organisms-by-name', '/organisms/');
			break;
		case 'companionship':
			await removeDocuments('/get-all-companionships', '/companionships/');
			break;
		}
	}
}

/**
 * @param {String} name
 * @param {Number} index
 * @param {Number} length
 */
async function getOrganismsByName(name, index, length) {
	const httpOptions = {
		method: 'GET',
		uri: getApiUrl() + '/get-organisms-by-name?name=' + name + '&index=' + index + '&length=' + length,
		json: true,
	};
	
	let response;
	try {
		response = await request(httpOptions);
	} catch (exception) {
		debug(exception);
		return null;
	}
	
	return response;
}

/**
 *
 */
async function doGetOrganismsByName() {
	const name = parseOption('name');
	const index = parseOption('index');
	const length = parseOption('length');
	
	const organisms = await getOrganismsByName(name, index, length);
	
	log(organisms);
}

/**
 * {beans,cabbage,peas},apple
 */
async function doGetCropGroups() {
	const crops = parseOptionArray('crop');
	
	const httpOptions = {
		method: 'POST',
		uri: getApiUrl() + '/get-crop-groups',
		json: true,
		body: { cropIds: crops }
	};
	
	let response;
	try {
		response = await request(httpOptions);
	} catch (exception) {
		debug(exception);
		return null;
	}
	
	log(response);
}

/**
 *
 */
async function doGetCompatibleCrops() {
	const crops = parseOptionArray('crop');
	
	const httpOptions = {
		method: 'POST',
		uri: getApiUrl() + '/get-compatible-crops',
		json: true,
		body: { cropIds: crops }
	};
	
	let response;
	try {
		response = await request(httpOptions);
	} catch (exception) {
		debug(exception);
		return null;
	}
	
	log(response);
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
		database: 'permaflorae',
	};
	
	Object.assign(mysqlConfig, parseOption('mysqlConfig'));
	const connection = await mysql.createConnection(mysqlConfig);
	const [rows, fields] = await connection.query('select `common name`,`latin name` from `species database`');
	connection.end();
	
	const scheduler = new SerialScheduler();
	rows.forEach((row) => {
		debug(row);
		const organism = {
			commonName: row['common name'],
			binomialName: row['latin name']
		};
		scheduler.push(new Task(undefined, pushDocument, '/organisms/', organism));
	});
	scheduler.activate();
}

/**
 * @param {Object} firebasePlant
 * @param {Object} firebaseToMongo Map of firebase IDs to Mongo IDs
 */
async function pushFirebasePlant(firebaseId, firebasePlant, firebaseToMongo) {
	debug('Start pushing ' + firebaseId + ' ' + JSON.stringify(firebasePlant));
	
	const convertedOrganism = {
		commonName: firebasePlant.display_name,
		binomialName: firebasePlant.display_name
	};
	
	let savedOrganism = await pushDocument('/organisms/', convertedOrganism);
	if (savedOrganism) {
		firebaseToMongo[firebaseId] = savedOrganism._id;
	}
}

/**
 * @param {Object} firebaseToMongo Map of firebase IDs to Mongo IDs
 * @param {String} firebaseId0
 * @param {String} firebaseId1
 */
async function pushFirebaseCompanion(firebaseToMongo, firebaseId0, firebaseId1, value) {
	const companionship = {
		crop1: firebaseToMongo[firebaseId0],
		crop2: firebaseToMongo[firebaseId1],
		compatibility: (value == 'good') ? 1 : -1
	};
	
	await pushDocument('/companionships/', companionship);
}

/**
 * Push the initial plant and companionship data from Firebase database to
 * powerplant server.
 */
async function pushFirebase() {
	const firebaseConfig = {
		apiKey: 'AIzaSyCKLggXck_1fxtoSn0uvjQ00gEapjLJDbM',
		authDomain: 'companion-planting-b56b5.firebaseapp.com',
		databaseURL: 'https://companion-planting-b56b5.firebaseio.com',
		projectId: 'companion-planting-b56b5',
		storageBucket: 'companion-planting-b56b5.appspot.com',
		messagingSenderId: '158677284326'
	};
	firebase.initializeApp(firebaseConfig);

	const firebaseData = (await firebase.database().ref('/').once('value')).val();
	firebase.database().goOffline();
	
	const firebasePlants = firebaseData.plants;
	const firebaseCompanions = firebaseData.companions;
	debug(firebaseData);

	const firebaseToMongo = {};
	
	const scheduler = new SerialScheduler();
	const plantScheduler = new SerialScheduler();
	const companionshipScheduler = new SerialScheduler();
	
	scheduler.push(new SchedulerTask(plantScheduler));
	scheduler.push(new SchedulerTask(companionshipScheduler));
	
	Object.keys(firebasePlants).forEach((firebaseId) => {
		plantScheduler.push(new Task(undefined, pushFirebasePlant, firebaseId, firebasePlants[firebaseId], firebaseToMongo));
	});
	
	Object.keys(firebaseCompanions).forEach((firebaseId0) => {
		Object.keys(firebaseCompanions[firebaseId0]).forEach((firebaseId1) => {
			const value = firebaseCompanions[firebaseId0][firebaseId1];
			if (value) {
				companionshipScheduler.push(new Task(undefined, pushFirebaseCompanion, firebaseToMongo, firebaseId0, firebaseId1, value));
				delete firebaseCompanions[firebaseId1][firebaseId0];
			}
		});
	});
	
	scheduler.activate();
}

/*
 * Global options
 */
let verbose = false;
let powerplantConfig = {
	host: 'localhost',
	port: 8080
};

/*
 * First command line argument is the command, rest of the arguments are options
 * for the command.
 */
const commands = {
	'remove': doRemove,
	'add': doAdd,
	'update': doUpdate,
	'show': doShow,
	'get-organisms-by-name': doGetOrganismsByName,
	'get-crop-groups': doGetCropGroups,
	'get-compatible-crops': doGetCompatibleCrops,
	'push-pfaf': pushPfaf,
	'push-firebase': pushFirebase
};

const commandLineArguments = process.argv.slice(2);
const nonOptionArguments = getNonOptionArguments();
const optionArguments = getOptionArguments();

if (nonOptionArguments.length > 0) {
	verbose = parseOption('verbose');
	Object.assign(powerplantConfig, parseOption('powerplantConfig'));
	
	commands[nonOptionArguments[0]]();
}
