import {post, get} from 'utils';

export function userSignupRequest(userData) {
  return dispatch => post('/api/users', userData);
}

export function userLoginRequest(loginData) {
  return dispatch => get('/login', loginData);
}
