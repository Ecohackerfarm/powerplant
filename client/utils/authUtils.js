const axios = require('axios');

/**
 * Set the authorization header for all future axios requests
 * @function
 * @param {String} token - JSON web token
 */
function setAuthorizationToken(token) {
	if (token) {
		axios.defaults.headers.common['authorization'] = 'Bearer ' + token;
	} else {
		delete axios.defaults.headers.common['authorization'];
	}
}

module.exports = {
	setAuthorizationToken
};
