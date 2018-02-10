/**
 * Reducer for setting the title
 * 
 * @namespace title
 * @memberof client.reducers
 */

const { SET_TITLE } = require('../actions');

/**
 * @constant {String}
 */
const initialState = 'powerplant';

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
function title(state = initialState, action) {
	switch (action.type) {
		case SET_TITLE:
			return action.title;
		default:
			return state;
	}
};

module.exports = {
	title
};
