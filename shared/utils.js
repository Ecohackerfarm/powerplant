/**
 * @namespace utils
 * @memberof shared
 */

const secrets = require('../secrets.js');

/**
 * TODO Is there an easier native way to do this?
 * TODO Note that a cycle results in infinite recursion.
 * TODO Make output pretty.
 *
 * @param {Object} object
 * @return {String}
 */
function convertObjectToString(object) {
  let string = '{';
  for (let property in object) {
    string +=
      "'" + property + "':" + convertValueToString(object[property]) + ',\n';
  }
  string += '}';
  return string;
}

/**
 * @param {Object} value
 * @return {String}
 */
function convertValueToString(value) {
  let string = '';
  if (value === null || value === undefined) {
    string += '' + value;
  } else if (Array.isArray(value)) {
    string += '[';
    value.forEach(element => {
      string += convertValueToString(element);
      string += ',';
    });
    string += ']';
  } else if (typeof value === 'object') {
    string += convertObjectToString(value);
  } else if (typeof value === 'string') {
    string +=
      "'" +
      value
        .split("'")
        .join("\\'")
        .split('\n')
        .join('\\n') +
      "'";
  } else {
    string += '' + value;
  }
  return string;
}

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
 * @param {String[]} array0
 * @param {String[]} array1
 * @return {Boolean}
 */
function areArraysEqual(array0, array1) {
  return (
    array0.length === array1.length &&
    array0.every((element, index) => element === array1[index])
  );
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
  convertObjectToString,
  areSetsEqual,
  addAllToSet,
  areArraysEqual,
  toCamelCase,
  getPouchDatabaseUrl,
  getPouchAdminDatabaseUrl,
  getHttpServerUrl
};
