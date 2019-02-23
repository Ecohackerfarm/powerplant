/**
 * Utility functions
 * 
 * @namespace utils
 * @memberof server
 */

const {
	DATABASE_USERNAME,
	DATABASE_PASSWORD,
	DATABASE_PROTOCOLL,
	DATABASE_HOST,
	DATABASE_PORT,
	DATABASE_DB
} = require('../secrets.js');

/**
 * @return {String}
 */
function getDatabaseURL() {
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
 * Check if development mode is on.
 * 
 * @return {Boolean}
 */
function isDevelopmentMode() {
	return process.env.NODE_ENV == 'development';
}

/**
 * Print debug message if in development mode.
 * 
 * @param {Object} message
 */
function debug(message) {
	if (isDevelopmentMode()) {
		console.log(message);
	}
}

module.exports = {
	getDatabaseURL,
	isDevelopmentMode,
	debug
};
