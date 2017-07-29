/**
 * @namespace locationActions
 * @memberof client.actions
 */

import axios from 'axios';
import {EDIT_LOCATION, ADD_LOCATION, DELETE_LOCATION, SET_LOCATIONS} from './types';
import {store} from '/client/index';
import {randString} from '/client/utils';

/**
 * Async sends a request to get all the user's locations
 * On response, dispatches a {@link client.actions.locationActions.SET_LOCATIONS SET_LOCATIONS} action
 * @function
 * @param  {String} id id of users whose locations are being fetched
 * @return {Promise}    the network request
 */
export const getLocationsRequest = (id) => {
  return dispatch => axios.get('/api/users/id/' + id + '/locations')
    .then((res) => {
      if (res.status === 200) {
        dispatch(setLocations(res.data));
      }
      return res;
    })
}

/**
 * Async sends a request to save a location, dispatches an {@link client.actions.locationActions.ADD_LOCATION ADD_LOCATION} action
 * on success
 * @function
 * @param  {server.models.Location} location unlike server model, does not require an _id parameter
 * @return {Promise} resolves to a {@link client.actions.responseObject}
 */
export const saveLocationRequest = (location) => {
  return dispatch => {
    if (store.getState().auth.isAuthenticated) {
      return axios.post('/api/locations', location)
      .then((res) => {
        if (res.status === 201) {
          dispatch(addLocation(res.data));
          return {success: true};
        }
        else {
          return {
            // TODO: properly handle server error
            success: false,
            ...res.data // es7 object spread
          };
        }
      })
    }
    else {
      // in LocationItem we specified that locations need ids
      // we should make this look the same as a mongodb location item
      // user is not authenticated so we will just save it to redux
      // returning a promise so it looks the same to the component that called it as if it had been a server request
      return new Promise(resolve => {
        location._id = store.getState().locations.length.toString();
        dispatch(addLocation(location));
        resolve({
          success: true
        });
      })
    }
  }
}

// since we are only just posting these to the server, these locations could possibly not have valid ids yet
// if it doesn't, we need to change its id once saved (in the reducer)
/**
 * Async makes a request to save an array of locations on the server, then updates them in the store if successful by dispatching {@link client.action.locationActions.EDIT_LOCATION EDIT_LOCATION} requests
 * @function
 * @param  {server.model.Location[]} locations locations to be saved
 * @return {Promise} resolves to a {@link client.actions.responseObject}
 */
export const saveAllLocationsRequest = (locations) => {
  return dispatch => {
    const oldLocations = locations.slice(); // make a copy
    const requests = locations.map(loc => axios.post('/api/locations', loc));
    return Promise.all(requests)
    .then((results) => {
      let success = true;
      results.forEach((res, i) => {
        if (res.status === 200) {
          // if success, update to have the object id
          dispatch(editLocation(oldLocations[i], res.data));
        }
        else {
          success = false;
        }
      })
      return {success};
    })
  }
}

/**
 * Build an {@link client.actions.locationActions.ADD_LOCATION ADD_LOCATION} action
 * @function
 * @param {server.models.Location} location location to be added
 * @return {client.actions.locationActions.ADD_LOCATION}
 */
export const addLocation = (location) => {
  return {
    type: ADD_LOCATION,
    location
  }
}

/**
 * Build an {@link client.actions.locationActions.EDIT_LOCATION EDIT_LOCATION} action
 * @function
 * @param  {server.models.Location} before [description]
 * @param  {server.models.Location} after  [description]
 * @return {client.actions.locationActions.EDIT_LOCATION}        [description]
 */
export const editLocation = (before, after) => {
  type: EDIT_LOCATION,
  before,
  after
}

/**
 * Build a {@link client.actions.locationActions.SET_LOCATIONS SET_LOCATIONS} action
 * @function
 * @param {server.models.Location[]} locations
 * @return {client.actions.locationActions.SET_LOCATIONS}
 */
export const setLocations = (locations) => {
  return {
    type: SET_LOCATIONS,
    locations
  }
}

/**
 * Pure action to add a single location
 * @typedef {Object} ADD_LOCATION
 * @memberof client.actions.locationActions
 * @property {String} [type=ADD_LOCATION]
 * @property {server.models.Location} location location to be added
 */

/**
* Pure action to set all locations in the redux store
* Will remove all current locations and replace them will the specified array
* @typedef {Object} SET_LOCATIONS
* @memberof client.actions.locationActions
* @property {String} [type=SET_LOCATIONS]
* @property {server.models.Location[]} locations locations to replace the current locations in the store
*/

/**
 * Pure action to edit a location
 * @typedef {Object} EDIT_LOCATION
 * @memberof client.actions.locationActions
 * @property {String} [type=EDIT_LOCATION]
 * @property {server.models.Location} before the location to be replaced
 * @property {server.models.Location} after the new location
 */
