import axios from 'axios';
import {EDIT_LOCATION, ADD_LOCATION, DELETE_LOCATION, SET_LOCATIONS} from './types';
import {store} from '/client/index';
import {randString} from '/client/utils';

export const getLocationsRequest = (id) => {
  return dispatch => axios.get('/api/users/id/' + id + '/locations')
    .then((res) => {
      if (res.status === 200) {
        dispatch(setLocations(res.data));
      }
      return res;
    })
}

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
export const saveAllLocationsRequest = (locations) => {
  return dispatch => {
    const oldLocations = locations.slice(); // make a copy
    const requests = locations.map(loc => axios.post('/api/locations', loc));
    Promise.all(requests)
    .then((results) => {
      results.forEach((res, i) => {
        if (res.status === 200) {
          // if success, update to have the object id
          dispatch(editLocation(oldLocations[i], res.data));
        }
        else {
          // if not success, update to show error message that the location could not be saved
          dispatch(setLocationError(locations[i], res.data.message))
        }
      })
    })
  }
}

export const addLocation = (location) => {
  return {
    type: ADD_LOCATION,
    location
  }
}

export const editLocation = (before, after) => {
  type: EDIT_LOCATION,
  before,
  after
}

export const setLocations = (locations) => {
  return {
    type: SET_LOCATIONS,
    locations
  }
}
