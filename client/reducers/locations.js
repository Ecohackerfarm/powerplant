/**
 * Reducer for actions that manage locations
 * 
 * @namespace locations
 * @memberof client.reducers
 */

const {
	ADD_LOCATION,
	SET_LOCATIONS,
	EDIT_LOCATION,
	DELETE_LOCATION,
	EDIT_BED,
	ADD_BED,
	DELETE_BED,
	LOGOUT,
} = require('../actions');

/**
 * @constant {Object}
 */
const initialState = {};

/**
 * @param {Object} state Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
function locations(state = initialState, action) {
	let newState;
	switch (action.type) {
		case SET_LOCATIONS:
			return action.locations;
		case ADD_LOCATION:
			return Object.assign({}, state, action.locationEntry);
		case EDIT_LOCATION: {
			return Object.assign({}, state, {
				[action.id]: Object.assign({}, state[action.id], action.changes)
			});
		}
		case DELETE_LOCATION: {
			newState = Object.assign({}, state);
			delete newState[action.id];
			return newState;
		}
		case ADD_BED: {
			newState = Object.assign({}, state);
			//add beds in newState in the specified location
			newState[action.locationId].beds = Object.assign({},
				newState[action.locationId].beds,
				action.bedEntry);
			return newState;
		}
		case EDIT_BED: {
			newState = Object.assign({}, state);
			//add beds in newState in the specified location
			newState[action.locationId].beds[action.bedId] = Object.assign({}, newState[action.locationId].beds[action.bedId], action.changes);
			return newState;
		}
		case DELETE_BED: {
			newState = Object.assign({}, state);
			//add beds in newState in the specified location
			delete newState[action.locationId].beds[action.bedId];
			return newState;
		}
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
}

module.exports = {
	locations
};
