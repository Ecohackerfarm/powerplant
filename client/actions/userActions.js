import axios from 'axios';
import {store} from '/client/index';
import {setAuthorizationToken} from '/client/utils'
import jwtDecode from 'jwt-decode';

export function userSignupRequest(userData) {
  return dispatch => axios.post('/api/users', userData);
}

export function userLoginRequest(loginData) {
  return dispatch => {
    return axios.post('/api/auth', {}, {
      auth: loginData
    })
    .then((res) => {
      if (res.ok) {
        setAuthorizationToken(res.data);
        dispatch(setCurrentUser(jwtDecode(res.data)));
      }
    })
  }
}

export function setCurrentUser(user) {
  return {
    type: 'SET_CURRENT_USER',
    user
  }
}
