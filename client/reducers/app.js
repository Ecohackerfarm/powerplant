/**
 * Reducer for application actions
 * 
 * @namespace app
 * @memberof client.reducers
 */

const {
	STORE_LOADED,
	SET_HEADER_TITLE
} = require('../actions');

/**
 * @constant {Object}
 * @property {Boolean} storeLoaded
 * @property {String} headerTitle
 */
const initialState = {
	storeLoaded: false,
	headerTitle: 'powerplant'
};

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
function app(state = initialState, action) {
	switch (action.type) {
		case STORE_LOADED:
			return Object.assign({}, state, {
				storeLoaded: action.storeLoaded
			});
		case SET_HEADER_TITLE:
			return Object.assign({}, state, {
				headerTitle: action.title
			});
		default:
	  		return state;
  	}
}

module.exports = {
	app
};
