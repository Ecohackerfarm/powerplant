/**
 * Defines Redux action types and action creators. All action objects are
 * created by an action creator even if they don't have any parameters.
 * 
 * @namespace actions
 * @memberof client
 */

/*
 * Action types
 */
const STORE_LOADED = 'STORE_LOADED';
const SET_HEADER_TITLE = 'SET_HEADER_TITLE';
const SET_TITLE = 'SET_TITLE';

const SET_CURRENT_USER = 'SET_CURRENT_USER';
const LOGOUT = 'LOGOUT';

const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
const EDIT_LOCATION = 'EDIT_LOCATION';
const ADD_LOCATION = 'ADD_LOCATION';
const DELETE_LOCATION = 'DELETE_LOCATION';
const SET_LOCATIONS = 'SET_LOCATIONS';

const EDIT_BED = 'EDIT_BED';
const ADD_BED = 'ADD_BED';
const DELETE_BED = 'DELETE_BED';

const CROPS_LOADING = 'CROPS_LOADING';
const CROP_RELATIONSHIPS_LOADING = 'CROP_RELATIONSHIPS_LOADING';
const CROPS_UPDATED = 'CROPS_UPDATED';
const CROP_RELATIONSHIPS_UPDATED = 'CROP_RELATIONSHIPS_UPDATED';
const CROPS_LOADING_ERROR = 'CROPS_LOADING_ERROR';
const CROP_RELATIONSHIPS_LOADING_ERROR = 'CROP_RELATIONSHIPS_LOADING_ERROR';

const VERSION_UPDATED = 'VERSION_UPDATED';

/**
 * Indicate that the persisted Redux store has been loaded.
 * 
 * @function
 * @return {Object} Action object
 */
const storeLoaded = () => ({
	type: STORE_LOADED,
	storeLoaded: true
});

/**
 * Set header title.
 * 
 * @function
 * @param {String} title 
 * @return {Object} Action object
 */
const setHeaderTitle = (title) => ({
	type: SET_HEADER_TITLE,
	title
});
   
/**
 * Set title.
 * 
 * @function
 * @param {String} title New title to display
 * @return {Object} Action object
 */
const setTitle = (title) => ({
	type: SET_TITLE,
	title
});

/**
 * Add location document.
 * 
 * @function
 * @param {server.models.Location} location
 * @return {Object} Action object
 */
const addLocation = (locationEntry) => ({
	type: ADD_LOCATION,
	locationEntry
});

/**
 * Modify location document.
 * 
 * @function
 * @param {ObjectId|String} id Document ID
 * @param {server.models.Location} changes Changes to document
 * @return {Object} Action object
 */
const editLocation = (id, changes) => ({
	type: EDIT_LOCATION,
	id,
	changes
});

/**
 * Delete location document.
 * 
 * @function
 * @param {ObjectId|String} id Document ID
 * @return {Object} Action object
 */
const deleteLocation = id => ({
	type: DELETE_LOCATION,
	id
});

/**
 * Set location documents.
 * 
 * @function
 * @param {server.models.Location[]} locations
 * @return {Object} Action object
 */
const setLocations = locations => ({
	type: SET_LOCATIONS,
	locations
});

/**
 * Add bed document.
 * 
 * @function
 * @param {ObjectId|String} locationId 
 * @param {Object} bedEntry 
 * @return {Object} Action object
 */
const addBed = (locationId, bedEntry) => ({
	type: ADD_BED,
	locationId,
	bedEntry
});

/**
 * Modify bed document.
 * 
 * @function
 * @param {ObjectId|String} locationId 
 * @param {ObjectId|String} bedId 
 * @param {Object} changes 
 * @return {Object} Action object
 */
const editBed = (locationId, bedId, changes) => ({
	type: EDIT_BED,
	locationId,
	bedId,
	changes
});

/**
 * Delete bed document.
 * 
 * @function
 * @param {ObjectId|String} locationId 
 * @param {ObjectId|String} bedId 
 * @return {Object} Action object
 */
const deleteBed = (locationId, bedId) => ({
	type: DELETE_BED,
	locationId,
	bedId
});

/**
 * Inform that fetching of crops failed.
 * 
 * @function
 * @param {Object} respone Response from failed API call
 * @return {Object} Action object
 */
const cropsLoadingError = (respone) => ({
	type: CROPS_LOADING_ERROR,
	respone
});

/**
 * Inform that fetching of crop relationships failed.
 * 
 * @function
 * @param {Object} respone Response from failed API CALL
 * @return {Object} Action object
 */
const cropRelationshipsLoadingError = (respone) => ({
	type: CROP_RELATIONSHIPS_LOADING_ERROR,
	respone
});

/**
 * Inform that crops have been received.
 * 
 * @function
 * @param {Object} data Crop data from API call
 * @return {Object} Action object
 */
const cropsUpdated = (data) => ({
	type: CROPS_UPDATED,
	all: data,
	updated: (new Date()).getTime()
});

/**
 * Inform that crop relationships have been received.
 * 
 * @function
 * @param {Object} data Crop relationship data form API call
 * @return {Object} Action object
 */
const cropRelationshipsUpdated = (data) => ({
	type: CROP_RELATIONSHIPS_UPDATED,
	relationships: data,
	relationshipsUpdated: (new Date()).getTime()
});

/**
 * Inform that crops are being loaded from the server.
 * 
 * @function
 * @param {Object} started 
 * @return {Object} Action object
 */
const cropsLoading = (started) => ({
	type: CROPS_LOADING,
	loading: started
});

/**
 * Inform that crop relationships are being loaded from the server.
 * 
 * @function
 * @param {Object} started 
 * @return {Object} Action object
 */
const cropRelationshipsLoading = (started) => ({
	type: CROP_RELATIONSHIPS_LOADING,
	loading: started
});

/**
 * Logout.
 * 
 * @function
 * @return {Object} Action object
 */
const logout = () => ({
	type: LOGOUT
});

/**
 * Set current authenticated user.
 * 
 * @function
 * @param {server.models.User} user
 * @return {Object} Action object
 */
const setCurrentUser = (user) => ({
	type: SET_CURRENT_USER,
	user
});

/**
 * Update version information.
 *
 * @function
 * @param {Object} version
 * @return {Object} Action object
 */
const versionUpdated = (version) => ({
	type: VERSION_UPDATED,
	version
});

module.exports = {
	STORE_LOADED,
	SET_HEADER_TITLE,
	SET_TITLE,
	SET_CURRENT_USER,
	LOGOUT,
	SET_CURRENT_LOCATION,
	EDIT_LOCATION,
	ADD_LOCATION,
	DELETE_LOCATION,
	SET_LOCATIONS,
	EDIT_BED,
	ADD_BED,
	DELETE_BED,
	CROPS_LOADING,
	CROP_RELATIONSHIPS_LOADING,
	CROPS_UPDATED,
	CROP_RELATIONSHIPS_UPDATED,
	CROPS_LOADING_ERROR,
	CROP_RELATIONSHIPS_LOADING_ERROR,
	VERSION_UPDATED,
	storeLoaded,
	setHeaderTitle,
	setTitle,
	setCurrentUser,
	logout,
	editLocation,
	addLocation,
	deleteLocation,
	setLocations,
	editBed,
	addBed,
	deleteBed,
	cropsLoading,
	cropRelationshipsLoading,
	cropsUpdated,
	cropRelationshipsUpdated,
	cropsLoadingError,
	cropRelationshipsLoadingError,
	versionUpdated
};
