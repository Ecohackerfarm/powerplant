import axios from 'axios';
import {setAuthorizationToken} from '/client/utils'
import jwtDecode from 'jwt-decode';
import {SET_CURRENT_USER, LOGOUT} from './types';
import {getLocationsRequest} from './locationActions';

// creating a thunk action that dispatches SET_CURRENT_USER once the sign up request is successful
// the desired functionality: a user creates an account, and all local data that they had previously
// saved while not logged in gets saved to their new account, and they become authenticated as that user
export function userSignupRequest(userData) {
  return dispatch => axios.post('/api/users', userData)
    .then((res) => {
      return dispatch(userLoginRequest(userData))
    })
    .then((loginRes) => {
      // now we are logged in
      // TODO: figure out how to transfer all redux data to server-stored user data

    });
}

// creating a thunk action that only dispatches a SET_CURRENT_USER request
// once the login request is successful
export function userLoginRequest(loginData) {
  return dispatch => {
    return axios.post('/api/login', loginData)
    .then(res => {
      if (res.status === 200) {
        dispatch(setUserFromToken(res.data.token));
      }
      console.log("Dispatched request, returning");
      return res;
    });
  }
}

export function setUserFromToken(token) {
  return dispatch => {
    setAuthorizationToken(token);
    localStorage.setItem('jwtToken', token);
    const user = jwtDecode(token);
    dispatch(setCurrentUser(user));
    dispatch(getLocationsRequest(user.id));
  }
}

export function userLogoutRequest() {
  setAuthorizationToken(false);
  localStorage.removeItem('jwtToken');
  dispatch(logoutUser());
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
