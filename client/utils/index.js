/**
 * Client-side utility functions
 * 
 * @namespace utils
 * @memberof client
 */

const { setAuthorizationToken } = require('./authUtils');
const { randString } = require('./randString');

module.exports = {
    setAuthorizationToken,
    randString
};
