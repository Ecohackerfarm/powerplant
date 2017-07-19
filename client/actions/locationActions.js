import axios from 'axios';
import {EDIT_LOCATION, ADD_LOCATION, DELETE_LOCATION, SET_LOCATIONS} from './types';

export const getLocationsRequest = (id) => {
  return dispatch => axios.get('/api/users/id/' + id + '/locations')
    .then((res) => {
      if (res.status === 200) {
        dispatch(setLocations(res.data));
      }
      return res;
    })
}

export const setLocations = (locations) => {
  return {
    type: SET_LOCATIONS,
    locations
  }
}
