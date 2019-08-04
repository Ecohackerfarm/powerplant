/**
 * Redux action types and basic action creators.
 *
 * @namespace actions
 * @memberof client.redux
 */

function addCrop(crop) {
  return {
    type: ADD_CROP,
    document: crop
  };
}

function updateCrop(crop) {
  return {
    type: UPDATE_CROP,
    document: crop
  };
}

function removeCrop(crop) {
  return {
    type: REMOVE_CROP,
    document: crop
  };
}

/**
 * Indicate that the persisted Redux store has been loaded.
 *
 * @return {Object} Action object
 */
function storeLoaded() {
  return {
    type: STORE_LOADED,
    loaded: true
  };
}

/*
 * Action types
 */
const ADD_CROP = 'ADD_CROP';
const UPDATE_CROP = 'EDIT_CROP';
const REMOVE_CROP = 'REMOVE_CROP';

const STORE_LOADED = 'STORE_LOADED';

module.exports = {
  addCrop,
  updateCrop,
  removeCrop,
  storeLoaded,

  ADD_CROP,
  UPDATE_CROP,
  REMOVE_CROP,
  STORE_LOADED
};
