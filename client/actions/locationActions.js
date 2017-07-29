/**
 * @namespace locationActions
 * @memberof client.actions
 */

import axios from 'axios';
import {editLocation, addLocation, deleteLocation, setLocations} from '.';
import {store} from '/client/index';
import {randString} from '/client/utils';

/**
 * Async sends a request to get all the user's locations
 * On response, dispatches a {@link client.actions.setLocationsAction setLocationsAction}
 * @function
 * @param  {String} id id of user whose locations are being fetched
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
 * Async sends a request to save a location, dispatches an {@link client.actions.addLocationAction addLocationAction}
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
 * Async makes a request to save an array of locations on the server, then updates them in the store if successful by
 * dispatching {@link client.actions.editLocationAction editLocationAction} requests
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
