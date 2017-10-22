import url from 'url';
import request from 'request-promise';
import mysql from 'mysql2/promise';
import firebase from 'firebase';
import { Task, SchedulerTask, SerialScheduler, ParallelScheduler } from 'async-task-schedulers';

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
 * Find a command line option either in the form '--optionName=key:value...' or
 * '--optionName=value', and return either an object or a value.
 *
 * @param {String} optionName
 * @return {Object}
 */
function parseOption(optionName) {
	const optionStringWithoutValue = '--' + optionName + '=';
	const option = options.find(option => option.startsWith(optionStringWithoutValue));
	
	let value = null;
	if (option) {
		let optionValue = option.slice(optionStringWithoutValue.length);
		value = optionValue.includes(':')
			? eval('({' + optionValue + '})') : eval('(' + optionValue + ')');
	}
	
	return value;
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
	
	log('Removed ' + options[1] + ' ' + id);
}

/**
 * Remove all documents.
 *
 * @param {String} path
 */
async function removeDocuments(path) {
	const httpOptions = {
		method: 'GET',
		uri: getApiUrl() + path,
		json: true
	};

	let documents;
	try {
		documents = await request(httpOptions);
	} catch (exception) {
		debug(exception);
		return;
	}
	debug(documents);
	
	const scheduler = new ParallelScheduler();
	documents.forEach((document) => {
		scheduler.push(new Task(removeDocument, [path, document._id]));
	});
	scheduler.activate();
}

/**
 * Remove documents.
 */
async function remove() {
	switch (options[1]) {
		case 'organism':
			await removeDocuments('/organisms/');
			break;
		case 'companionship':
			await removeDocuments('/companionships/');
			break;
	}
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
	
	const scheduler = new ParallelScheduler();
	rows.forEach((row) => {
		debug(row);
		const organism = {
			commonName: row['common name'],
			binomialName: row['latin name']
		};
		scheduler.push(new Task(pushDocument, ['/organisms/', organism]));
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
	const firebasePlants = firebaseData.plants;
	const firebaseCompanions = firebaseData.companions;
	debug(firebaseData);

	const firebaseToMongo = {};
	
	const scheduler = new SerialScheduler();
	const plantScheduler = new ParallelScheduler();
	const companionshipScheduler = new ParallelScheduler();
	
	scheduler.push(new SchedulerTask(plantScheduler));
	scheduler.push(new SchedulerTask(companionshipScheduler));
	
	Object.keys(firebasePlants).forEach((firebaseId) => {
		plantScheduler.push(new Task(pushFirebasePlant, [firebaseId, firebasePlants[firebaseId], firebaseToMongo]));
	});
	
	Object.keys(firebaseCompanions).forEach((firebaseId0) => {
		Object.keys(firebaseCompanions[firebaseId0]).forEach((firebaseId1) => {
			const value = firebaseCompanions[firebaseId0][firebaseId1];
			if (value) {
				companionshipScheduler.push(new Task(pushFirebaseCompanion, [firebaseToMongo, firebaseId0, firebaseId1, value]));
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
	'push-pfaf': pushPfaf,
	'push-firebase': pushFirebase,
	'remove': remove
};

const options = process.argv.slice(2);
if (options.length > 0) {
	const command = commands[options[0]];
	
	verbose = parseOption('verbose');
	Object.assign(powerplantConfig, parseOption('powerplantConfig'));
	
	command();
}
