import axios from 'axios';
import {setAuthorizationToken} from '/client/utils'
import jwtDecode from 'jwt-decode';
import {SET_CURRENT_USER, LOGOUT} from './types';

// TODO: either make this a redux action or just a HTTP regular request
export function userSignupRequest(userData) {
  return dispatch => axios.post('/api/users', userData);
}

export function userLoginRequest(loginData) {
  return dispatch => {
    return axios.post('/api/login', loginData)
    .then(res => {
      if (res.status === 200) {
        setAuthorizationToken(res.data.token);
        console.log("Dispatching SET_CURRENT_USER");
        dispatch(setCurrentUser(jwtDecode(res.data.token)));
      }
      return res;
    });
  }
}

export function userLogoutRequest() {
  return dispatch => {
    // since every reducer listens for this and resets data on logout
    // this is all we need to do
    dispatch(logoutUser());
  }
}

// pure action for when the user is ready to log out
export function logoutUser() {
  return {
    type: LOGOUT
  }
}

// pure action for when user is ready to log in
export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  }
}
