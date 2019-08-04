/**
 * @namespace reducers
 * @memberof client.redux
 */

const { combineReducers } = require('redux');
const actions = require('./actions.js');

const initialCropsState = {};
const initialAppState = {
  storeLoaded: false
};

/**
 * @param {Object} state  Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
function crops(state = initialCropsState, action) {
  const { type, document } = action;
  const newState = Object.assign({}, state);

  switch (type) {
    case actions.ADD_CROP:
    case actions.UPDATE_CROP:
      if (Array.isArray(document)) {
        const newObjects = {};
        document.forEach(doc => {
          newObjects[doc._id] = doc;
        });

        return Object.assign(newState, newObjects);
      } else {
        return Object.assign(newState, {
          [document._id]: document
        });
      }
    case actions.REMOVE_CROP:
      if (Array.isArray(document)) {
        document.forEach(doc => {
          delete newState[doc._id];
        });
      } else {
        delete newState[document._id];
      }
      return newState;
    default:
      return state; // FIXME Should probably fail fast here.
  }
}

/**
 * @param {Object} state  Current state
 * @param {Object} action Action object
 * @return {Object} Next state
 */
function app(state = initialAppState, action) {
  switch (action.type) {
    case actions.STORE_LOADED:
      return Object.assign({}, state, {
        storeLoaded: action.loaded
      });
    default:
      return state; // FIXME Should probably fail fast here.
  }
}

module.exports = combineReducers({
  crops,
  app
});
