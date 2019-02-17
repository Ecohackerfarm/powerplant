/**
 * API client based on axios
 *
 * Every api call should be able to call like this:
 * functionName({parameter}) => Promise
 *
 * e.g.:
 * getCropsByName(
 *   {  name : "foo",
 *      index : 0,
 *      length : 0,
 *   }
 * )
 *
 * In addition to API calls there are functions that configure the axios
 * HTTP client.
 *
 * @namespace api-client
 * @memberof shared
 */

const axios = require('axios');

/**
 * Set host and port of powerplant server for all future axios requests.
 *
 * @param {String} host
 * @param {Number} port
 */
function setBaseUrl(host, port) {
	axios.defaults.baseURL = 'http://' + host + (port ? (':' + port) : '');
}

/**
 * Set the authorization header for all future axios requests
 *
 * @param {String} token - JSON web token
 */
function setAuthorizationToken(token) {
	if (token) {
		axios.defaults.headers.common['authorization'] = 'Bearer ' + token;
	} else {
		delete axios.defaults.headers.common['authorization'];
	}
}

/**
 * Gets crops by names
 *
 * @param  {object} params parameter object
 * @param  {string} params.name part of the crops name
 * @param  {number} params.index=0 start index of the chunk of crops from found list
 * @param  {object} params.length=0 length of the chunk
 * @return {Promise} Promise
 */
function getCropsByName(params) {
	return axios.get(
		'/api/get-crops-by-name', { params }
	);
}

/**
 * Get compatible crop groups from
 *
 * @param  {Object} params parameter object
 * @param  {Array} params.cropIds array of ids of crops
 * @return {Promise} Promise
 */
function getCropGroups(params) {
	return axios.post(
		'/api/get-crop-groups',
		params
	);
}

/**
 * Get compatible crop groups from
 *
 * @param  {Object} params parameter object
 * @param  {Array} params.cropIds array of ids of crops
 * @return {Promise} Promise
 */
function getCompatibleCrops(params) {
	return axios.post(
		'/api/get-compatible-crops',
		params
	);
}

/**
 * Get locations from a specified user
 *
 * @param  {object} params parameter object
 * @param  {object} params.id user id
 * @return {Promise} Promise
 */
function getLocations(params) {
	return axios.get(
		'/api/users/' + params.id + '/locations'
	);
}

/**
 * Get crops
 *
 * @param  {Object} params
 * @param  {String[]} params.ids Document IDs
 * @return {Promise}
 */
function getCrops(params) {
	let promises = params.ids.map(id => getCrop({ id: id }));
	return Promise.all(promises);
}

/**
 * Get crop relationships
 *
 * @param  {Object} params
 * @param  {String[]} params.ids Document IDs
 * @return {Promise}
 */
function getCropRelationships(params) {
	let promises = params.ids.map(id => getCropRelationship({ id: id }));
	return Promise.all(promises);
}

/**
 * Get users
 *
 * @param  {Object} params
 * @param  {String[]} params.ids Document IDs
 * @return {Promise}
 */
function getUsers(params) {
	let promises = params.ids.map(id => getUser({ id: id }));
	return Promise.all(promises);
}

/**
 * Add crops
 *
 * @param  {Object} params
 * @param  {Object[]} params.documents Documents
 * @return {Promise}
 */
function addCrops(params) {
	let promises = params.documents.map(document => addCrop({ document: document }));
	return Promise.all(promises).then();
}

/**
 * Add crop relationships
 *
 * @param  {Object} params
 * @param  {Object[]} params.documents Documents
 * @return {Promise}
 */
function addCropRelationships(params) {
	let promises = params.documents.map(document => addCropRelationship({ document: document }));
	return Promise.all(promises);
}

/**
 * Add users
 *
 * @param  {Object} params
 * @param  {Object[]} params.documents Documents
 * @return {Promise}
 */
function addUsers(params) {
	let promises = params.documents.map(document => addUser({ document: document }));
	return Promise.all(promises);
}

/**
 * Update crops
 *
 * @param  {Object} params
 * @param  {Object[]} params.documents Documents
 * @param  {String[]} params.ids Document IDs
 * @return {Promise}
 */
function setCrops(params) {
	let promises = params.documents.map((document, index) => setCrop({ document: document, id: params.ids[index] }));
	return Promise.all(promises);
}

/**
 * Update crop relationships
 *
 * @param  {Object} params
 * @param  {Object[]} params.documents Documents
 * @return {Promise}
 */
function setCropRelationships(params) {
	let promises = params.documents.map((document, index) => setCropRelationship({ document: document, id: params.ids[index] }));
	return Promise.all(promises);
}

/**
 * Add users
 *
 * @param  {Object} params
 * @param  {Object[]} params.documents Documents
 * @return {Promise}
 */
function setUsers(params) {
	let promises = params.documents.map((document, index) => setUser({ document: document, id: params.ids[index] }));
	return Promise.all(promises);
}

/**
 * Delete crops
 *
 * @param  {Object} params
 * @param  {String[]} params.ids Document IDs
 * @return {Promise}
 */
function removeCrops(params) {
	let promises = params.ids.map(id => removeCrop({ id: id }));
	return Promise.all(promises);
}

/**
 * Delete crop relationships
 *
 * @param  {Object} params
 * @param  {String[]} params.ids Document IDs
 * @return {Promise}
 */
function removeCropRelationships(params) {
	let promises = params.ids.map(id => removeCropRelationship({ id: id }));
	return Promise.all(promises);
}

/**
 * Delete users
 *
 * @param  {Object} params
 * @param  {String[]} params.ids Document IDs
 * @return {Promise}
 */
function removeUsers(params) {
	let promises = params.ids.map(id => removeUser({ id: id }));
	return Promise.all(promises);
}

/**
 * Get all crop relationships
 *
 * @param {Object} params
 */
function getAllCropRelationships(params) {
	return axios.get('/api/get-all-crop-relationships');
}

/**
 * Delete all crops
 *
 * @param {Object} params
 */
function removeAllCrops(params) {
	return getCropsByName({ name: '', index: 0, length: 0 }).then(response => {
		const ids = response.data.map(crop => crop._id);
		removeCrops({ ids: ids });
	});
}

/**
 * Delete all crop relationships
 *
 * @param {Object} params
 */
function removeAllCropRelationships(params) {
	return getAllCropRelationships().then(response => {
		const ids = response.data.map(relationship => relationship._id);
		removeCropRelationships({ ids: ids });
	});
}

/**
 * Get crop
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @return {Promise}
 */
function getCrop(params) {
	return axios.get('/api/crops/' + params.id);
}

/**
 * Get crop relationship
 *
 * @param  {Object} params
 * @param  {Object} params.id
 * @return {Promise}
 */
function getCropRelationship(params) {
	return axios.get('/api/crop-relationships/' + params.id);
}

/**
 * Get user
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @return {Promise}
 */
function getUser(params) {
	return axios.get('/api/users/' + params.id);
}

/**
 * Add crop
 *
 * @param  {Object} params
 * @param  {Object} params.id Document
 * @return {Promise}
 */
function addCrop(params) {
	return axios.post('/api/crops/', params.document);
}

/**
 * Add crop relationship
 *
 * @param  {Object} params
 * @param  {Object} params.id Document
 * @return {Promise}
 */
function addCropRelationship(params) {
	return axios.post('/api/crop-relationships/', params.document);
}

/**
 * Add user
 *
 * @param  {Object} params
 * @param  {Object} params.id Document
 * @return {Promise}
 */
function addUser(params) {
	return axios.post('/api/users/', params.document);
}

/**
 * Update crop
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @param  {Object} params.document Document
 * @return {Promise}
 */
function setCrop(params) {
	return axios.put('/api/crops/' + params.id, params.document);
}

/**
 * Update crop relationship
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @param  {Object} params.document Document
 * @return {Promise}
 */
function setCropRelationship(params) {
	return axios.put('/api/crop-relationships/' + params.id, params.document);
}

/**
 * Update user
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @param  {Object} params.document Document
 * @return {Promise}
 */
function setUser(params) {
	return axios.put('/api/users/' + params.id, params.document);
}

/**
 * Delete crop
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @return {Promise}
 */
function removeCrop(params) {
	return axios.delete('/api/crops/' + params.id);
}

/**
 * Delete crop relationship
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @return {Promise}
 */
function removeCropRelationship(params) {
	return axios.delete('/api/crop-relationships/' + params.id);
}

/**
 * Delete user
 *
 * @param  {Object} params
 * @param  {Object} params.id Document ID
 * @return {Promise}
 */
function removeUser(params) {
	return axios.delete('/api/users/' + params.id);
}

module.exports = {
	setAuthorizationToken,
	setBaseUrl,

	addCrop,
	addCropRelationship,
	getCropsByName,
	getCropGroups,
	getCompatibleCrops,
	getLocations,
	getCrops,
	getCropRelationships,
	getUsers,
	addCrops,
	addCropRelationships,
	addUsers,
	setCrops,
	setCropRelationships,
	setUsers,
	removeCrops,
	removeCropRelationships,
	removeUsers,
	removeAllCrops,
	removeAllCropRelationships,
};
