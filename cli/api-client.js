/**
 * @namespace api-client
 * @memberof cli
 */

const {
	AsyncObject,
	schedulerFunction,
	SerialScheduler,
	ParallelScheduler
} = require('async-task-schedulers');
const axios = require('axios');

/**
 * Powerplant HTTP API client that uses axios for making the HTTP requests.
 *
 * @extends AsyncObject
 */
class ApiClient extends AsyncObject {
	/**
	 * @param {String} host
	 * @param {String} port
	 */
	constructor(host, port) {
		super();

		this.setBaseUrl(host, port);

		this.documents = {};
		this.documents['users'] = {};
		this.documents['crops'] = {};
		this.documents['crop-relationships'] = {};

		this.registerScheduler(this.getDocuments, this.scheduleAccessDocuments);
		this.registerScheduler(this.setDocuments, this.scheduleAccessDocuments);
		this.registerScheduler(this.addDocuments, this.scheduleAccessDocuments);
		this.registerScheduler(this.removeDocuments, this.scheduleAccessDocuments);

		this.registerScheduler(this.getCrops, this.scheduleDocumentAccess);
		this.registerScheduler(
			this.getCropRelationships,
			this.scheduleDocumentAccess
		);
		this.registerScheduler(this.getUsers, this.scheduleDocumentAccess);
		this.registerScheduler(this.setCrops, this.scheduleDocumentAccess);
		this.registerScheduler(
			this.setCropRelationships,
			this.scheduleDocumentAccess
		);
		this.registerScheduler(this.setUsers, this.scheduleDocumentAccess);
		this.registerScheduler(this.addCrops, this.scheduleDocumentAccess);
		this.registerScheduler(
			this.addCropRelationships,
			this.scheduleDocumentAccess
		);
		this.registerScheduler(this.addUsers, this.scheduleDocumentAccess);
		this.registerScheduler(this.removeCrops, this.scheduleDocumentAccess);
		this.registerScheduler(
			this.removeCropRelationships,
			this.scheduleDocumentAccess
		);
		this.registerScheduler(this.removeUsers, this.scheduleDocumentAccess);
	}

	/**
	 * Set base URL of powerplant server.
	 * 
	 * @param {String} host
	 * @param {Number} port
	 */
	setBaseUrl(host, port) {
		this.host = host;
		this.port = port;

		this.createAxiosInstance();
	}

	/**
	 * Set credentials that are used when logging in.
	 * 
	 * @param {String} username
	 * @param {String} password
	 */
	setCredentials(username, password) {
		this.username = username;
		this.password = password;
	}

	/**
	 * Create the internal axios instance that is used for making HTTP
	 * requests.
	 */
	createAxiosInstance() {
		const portString = this.port ? ':' + this.port : '';

		const config = {};
		config.baseURL = 'http://' + this.host + portString + '/api/';
		if (this.userToken) {
			config.headers = {
				Authorization: 'Bearer ' + this.userToken
			};
		}

		this.axios = axios.create(config);
	}

	/**
	 * Login to get access to user information.
	 */
	async login() {
		const response = await this.axios.post('login', {
			username: this.username,
			password: this.password
		});

		this.userToken = response.data.token;
		this.createAxiosInstance();
	}

	/**
	 * When getDocuments() is called, before actually executing the call,
	 * schedule each individual document to be fetched in parallel by
	 * getDocument() calls.
	 * 
	 * @param {AsyncFunction} method
	 * @param {String} path
	 * @param {String[]} ids
	 */
	scheduleAccessDocuments(method, path, ids, documents) {
		const methodNameToAccessor = {
			getDocuments: this.getDocument,
			setDocuments: this.setDocument,
			addDocuments: this.addDocument,
			removeDocuments: this.removeDocument
		};

		const accessScheduler = new ParallelScheduler();
		ids.forEach((id, index) => {
			let parameters =
				method == this.setDocuments ? [id, documents[index]] : [id];
			accessScheduler.push(
				this,
				methodNameToAccessor[method.name],
				path,
				...parameters
			);
		});

		const mainScheduler = new SerialScheduler();
		mainScheduler.push(undefined, schedulerFunction, accessScheduler);
		const task = mainScheduler.push(this, method, path, ids);
		mainScheduler.activate();

		return task;
	}

	/**
	 * Check if the given method requires to be logged in.
	 * 
	 * @param {AsyncFunction} method
	 * @return {Boolean}
	 */
	requiresLogin(method) {
		const methodNames = [this.getUsers.name];
		return methodNames.includes(method.name);
	}

	/**
	 * Schedule login() to be called (if not already logged in) before
	 * actually executing the method call.
	 * 
	 * @param {AsyncFunction} method
	 * @param {Object[]} parameters
	 */
	scheduleDocumentAccess(method, ...parameters) {
		const scheduler = new SerialScheduler();
		if (this.requiresLogin(method) && !this.userToken) {
			scheduler.push(this, this.login);
		}
		const task = scheduler.push(this, method, ...parameters);
		scheduler.activate();

		return task;
	}

	/**
	 * Cache document.
	 * 
	 * @param {String} path
	 * @param {String} id
	 * @param {Object} document
	 */
	cacheDocument(path, id, document) {
		this.documents[path][id] = document;
	}

	/**
	 * Get document from server and cache it.
	 * 
	 * @param {String} path
	 * @param {String} id
	 */
	async getDocument(path, id) {
		const response = await this.axios.get(path + '/' + id);
		this.cacheDocument(path, id, response.data);
	}

	/**
	 * Update document to server.
	 * 
	 * @param {String} path
	 * @param {String} id
	 * @param {Object} document
	 */
	async setDocument(path, id, document) {
		await this.axios.put(path + '/' + id, document);
	}

	/**
	 * Add document to server.
	 * 
	 * @param {String} path
	 * @param {Object} document
	 */
	async addDocument(path, document) {
		const response = await this.axios.post(path + '/', document);
		Object.assign(document, response.data);
	}

	/**
	 * Remove document from server.
	 * 
	 * @param {String} path
	 * @param {String} id
	 */
	async removeDocument(path, id) {
		await this.axios.delete(path + '/' + id);
	}

	/**
	 * Get array of documents.
	 * 
	 * @param {String} path
	 * @param {String[]} ids
	 * @return {Object[]}
	 */
	async getDocuments(path, ids) {
		return ids.map(id => this.documents[path][id]);
	}

	/**
	 * Update array of documents.
	 * 
	 * @param {String} path
	 * @param {String[]} ids
	 * @param {Object[]} documents
	 */
	async setDocuments(path, ids, documents) {}

	/**
	 * Add array of documents.
	 *
	 * @param {String} path
	 * @param {Object[]} documents
	 * @return {Object[]} Documents with IDs
	 */
	async addDocuments(path, documents) {
		return documents;
	}

	/**
	 * Remove array of documents.
	 * 
	 * @param {String} path
	 * @param {String[]} ids
	 */
	async removeDocuments(path, ids) {}

	/**
	 * Get array of User documents.
	 * 
	 * @param {String[]} ids
	 */
	async getUsers(ids) {
		return await this.getDocuments('users', ids);
	}

	/**
	 * Get array of Crop documents.
	 * 
	 * @param {String[]} ids
	 */
	async getCrops(ids) {
		return await this.getDocuments('crops', ids);
	}

	/**
	 * Get array of CropRelationship documents.
	 * 
	 * @param {String[]} ids
	 */
	async getCropRelationships(ids) {
		return await this.getDocuments('crop-relationships', ids);
	}

	/**
	 * Update set of User documents.
	 * 
	 * @param {Object} idToDocument
	 */
	async setUsers(idToDocument) {
		return await this.setDocuments(
			'users',
			Object.keys(idToDocument),
			Object.values(idToDocument)
		);
	}

	/**
	 * Update set of Crop documents.
	 * 
	 * @param {Object} idToDocument
	 */
	async setCrops(idToDocument) {
		return await this.setDocuments(
			'crops',
			Object.keys(idToDocument),
			Object.values(idToDocument)
		);
	}

	/**
	 * Update set of CropRelationship documents.
	 * 
	 * @param {Object} idToDocument
	 */
	async setCropRelationships(idToDocument) {
		return await this.setDocuments(
			'crop-relationships',
			Object.keys(idToDocument),
			Object.values(idToDocument)
		);
	}

	/**
	 * Add array of User documents.
	 * 
	 * @param {Object[]} documents
	 */
	async addUsers(documents) {
		return await this.addDocuments('users', documents);
	}

	/**
	 * Add array of Crop documents.
	 * 
	 * @param {Object[]} documents
	 */
	async addCrops(documents) {
		return await this.addDocuments('crops', documents);
	}

	/**
	 * Add array of CropRelationship documents.
	 * 
	 * @param {Object} documents
	 */
	async addCropRelationships(documents) {
		return await this.addDocuments('crop-relationships', documents);
	}

	/**
	 * Remove set of User documents.
	 * 
	 * @param {String[]} ids
	 */
	async removeUsers(ids) {
		await this.removeDocuments('users', ids);
	}

	/**
	 * Remove set of Crop documents.
	 * 
	 * @param {String[]} ids
	 */
	async removeCrops(ids) {
		await this.removeDocuments('crops', ids);
	}

	/**
	 * Remove set of CropRelationship documents.
	 * 
	 * @param {String[]} ids
	 */
	async removeCropRelationships(ids) {
		await this.removeDocuments('crop-relationships', ids);
	}

	/**
	 * Get crops whose name matches the given regular expression.
	 * 
	 * @param {String} name
	 * @param {Number} index
	 * @param {Number} length
	 * @return {Object[]}
	 */
	async getCropsByName(name, index, length) {
		const response = await this.axios.get('get-crops-by-name', {
			params: { name, index, length }
		});
		return response.data;
	}

	/**
	 * Get all CropRelationship documents.
	 * 
	 * @return {Object[]}
	 */
	async getAllCropRelationships() {
		const response = await this.axios.get('get-all-crop-relationships');
		return response.data;
	}

	/**
	 * Given a set of crops, divide them to groups of compatible crops.
	 * 
	 * @param {String[]} ids
	 * @return {Object[][]}
	 */
	async getCropGroups(ids) {
		const response = await this.axios.post('get-crop-groups', {
			cropIds: ids
		});
		return response.data;
	}

	/**
	 * Given a group of compatible crops, find all other crops that are
	 * compatible with the group. All crops in the sum set are compatible
	 * with each other.
	 * 
	 * @param {String[]} ids
	 * @return {Object[]}
	 */
	async getCompatibleCrops(ids) {
		const response = await this.axios.post('get-compatible-crops', {
			cropIds: ids
		});
		return response.data;
	}

	/**
	 * Get IDs from the given documents.
	 * 
	 * @param {Object[]} documents
	 * @return {String[]}
	 */
	static getIds(documents) {
		return documents.map(document => document._id);
	}

	/**
	 * Remove all Crop documents.
	 */
	async removeAllCrops() {
		const crops = await this.getCropsByName('', 0, 0);
		await this.removeCrops(ApiClient.getIds(crops));
	}

	/**
	 * Remove all CropRelationship documents.
	 */
	async removeAllCropRelationships() {
		const relationships = await this.getAllCropRelationships();
		await this.removeCropRelationships(ApiClient.getIds(relationships));
	}
}

module.exports = {
	ApiClient
};
