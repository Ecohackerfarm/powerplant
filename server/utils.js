/**
 * Utility functions
 * 
 * @namespace utils
 * @memberof server
 */

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
	isDevelopmentMode,
	debug
};
