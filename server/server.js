/**
 * Connects to MongoDB and starts the Express application.
 *
 * @namespace server
 * @memberof server
 */

import mongoose from 'mongoose';
import { buildApp } from './app';
import {
	DATABASE_USERNAME,
	DATABASE_PASSWORD,
	DATABASE_PROTOCOLL,
	DATABASE_HOST,
	DATABASE_PORT,
	DATABASE_DB,
	PP_PORT
} from '../secrets.js';

/**
 * Creates the url to the database from specified constants
 * @return {String} url to database
 */
const getDatabaseURL = () => {
	let urlString = DATABASE_PROTOCOLL;
	// Add username and password
	if (DATABASE_USERNAME.length > 0 && DATABASE_PASSWORD.length > 0) {
		urlString += DATABASE_USERNAME + ':' + DATABASE_PASSWORD + '@';
	}
	urlString += DATABASE_HOST;
	if (DATABASE_PORT.length > 0) {
		urlString += ':' + DATABASE_PORT;
	}
	urlString += '/' + DATABASE_DB;
	return urlString;
}
/**
 * Function called after server started
 * @param  {object} event
 * @return {undefined}
 */
const serverStarted = (event) => {
	console.log('Server running on port ' + port);
}

// if enviroment variable PORT is specified uses PORT otherwise PORT from secret.js
const port = process.env.PORT || PP_PORT;
// arguments for listening on localhost
const localhostArgs = ['127.0.0.1',511];

const app = buildApp(process.env.NODE_ENV === "development");

// if enviroment variable DATABASEURL is set use this other wise build it from secret.js
if (process.env.DATABASEURL) {
  mongoose.connect(process.env.DATABASEURL, { useMongoClient: true });
} else {
  mongoose.connect(getDatabaseURL(), { useMongoClient: true });
}

mongoose.Promise = global.Promise;

// if LOCALHOST_ONLY is set the server only listens to localhost
if (process.env.LOCALHOST_ONLY) {
	app.listen(
		port,
		...localhostArgs,
		serverStarted
	);
} else {
	app.listen(
		port,
		serverStarted
	);
}
