/**
 * @namespace utils
 * @memberof shared
 */

const secrets = require('../secrets.js');


/**
 * @param {String} name
 * @return {String}
 */
function toCamelCase(name) {
  return name
    .toLowerCase()
    .replace(/( [a-zA-Z])/g, match => match.toUpperCase())
    .replace(/ /g, '');
}

/**
 * @param {String} database
 * @return {String}
 */
function getPouchAdminDatabaseUrl(database) {
  return getPouchDatabaseUrl(database).replace(
    'http://',
    'http://' + secrets.ADMIN_USERNAME + ':' + secrets.ADMIN_PASSWORD + '@'
  );
}

/**
 * @param {String} database
 * @return {String}
 */
function getPouchDatabaseUrl(database) {
  return getHttpServerUrl() + 'db/' + database;
}

/**
 * @return {String}
 */
function getHttpServerUrl() {
  return (
    'http://' + secrets.HTTP_SERVER_HOST + ':' + secrets.HTTP_SERVER_PORT + '/'
  );
}

module.exports = {
  toCamelCase,
  getPouchDatabaseUrl,
  getPouchAdminDatabaseUrl,
  getHttpServerUrl
};
