/**
 * @namespace utils
 * @memberof shared
 */

const secrets = require('../secrets.js');

/**
 * @param {Crop[]} crops
 * @return {Object}
 */
function mapCropsByBinomialName(crops) {
  const binomialNameToCrop = {};
  crops.forEach(crop => {
    binomialNameToCrop[crop.binomialName] = crop;
  });
  return binomialNameToCrop;
}

/**
 * @param {Crop[]} crops
 * @return {String[]}
 */
function findTagSet(crops) {
  let tagSet = [];
  crops.forEach(crop => {
    const newTags = getCropTagNames(crop).filter(tag => !tagSet.includes(tag));
    tagSet = tagSet.concat(newTags);
  });
  return tagSet;
}

/**
 * @param {Crop} crop
 * @return {String[]}
 */
function getCropTagNames(crop) {
  return crop.tags.map(tag => tag.name);
}

/**
 * Every crop has a binomial name, common name is optional.
 *
 * @param {Crop} crop
 * @return {String}
 */
function getCropDisplayName(crop) {
  return crop.commonName
    ? crop.commonName + ' (' + crop.binomialName + ')'
    : crop.binomialName;
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
  mapCropsByBinomialName,
  findTagSet,
  getCropTagNames,
  getCropDisplayName,
  toCamelCase,
  getPouchDatabaseUrl,
  getPouchAdminDatabaseUrl,
  getHttpServerUrl
};
