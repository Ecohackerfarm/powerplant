/**
 * Reducer for actions that manage crops and crop relationships
 * 
 * @namespace crops
 * @memberof client.reducers
 */

const {
	CROPS_UPDATED,
	CROP_RELATIONSHIPS_UPDATED,
	CROPS_LOADING_ERROR,
	CROPS_LOADING,
	CROP_RELATIONSHIPS_LOADING,
	CROP_RELATIONSHIPS_LOADING_ERROR
} = require('../actions');

/**
 * @constant {Object}
 * @property {Crop[]} all
 * @property {Boolean} loading
 * @property {Number} updated
 * @property {Object} errorResponse
 * @property {Boolean} error
 * @property {Boolean} relationshipsLoading
 * @property {Number} relationshipsUpdated
 * @property {CropRelationship[]} relationships
 */
const initialState = {
	all: [],
	loading: false,
	updated: 0,
	errorResponse: {},
	error: false,
	relationshipsLoading: false,
	relationshipsUpdated: 0,
	relationships: []
};

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
function crops(state = initialState, action) {
	switch (action.type) {
		case CROPS_UPDATED:
			return Object.assign({}, state, {
				all: action.all,
				updated: action.updated,
				error: false
			});
		case CROPS_LOADING:
			return Object.assign({}, state, {
				loading: action.loading
			});
		case CROPS_LOADING_ERROR:
			return Object.assign({}, state, {
				errorResponse: action.response,
				error: true
			});
		case CROP_RELATIONSHIPS_UPDATED:
			return Object.assign({}, state, {
				relationships: action.relationships,
				relationshipsUpdated: action.relationshipsUpdated,
				error: false
			});
		case CROP_RELATIONSHIPS_LOADING:
			return Object.assign({}, state, {
				relationshipsLoading: action.loading
			});
		case CROP_RELATIONSHIPS_LOADING_ERROR:
			return Object.assign({}, state, {
				errorResponse: action.response,
				error: true
			});
		default:
			return state;
	}
};

module.exports = {
	crops
};
