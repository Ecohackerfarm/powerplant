/**
 * @namespace utils
 * @memberof shared
 */

const secrets = require('../secrets.js');

/**
 * @param {Set} set0
 * @param {Set} set1
 */
function areSetsEqual(set0, set1) {
  if (set0.size !== set1.size) {
    return false;
  }
  for (let value of set0) {
    if (!set1.has(value)) {
      return false;
    }
  }
  return true;
}

/**
 * @param {Set} setObject
 * @param {Object[]} array
 */
function addAllToSet(setObject, array) {
  array.forEach(value => setObject.add(value));
}

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
  areSetsEqual,
  addAllToSet,
  toCamelCase,
  getPouchDatabaseUrl,
  getPouchAdminDatabaseUrl,
  getHttpServerUrl
};
