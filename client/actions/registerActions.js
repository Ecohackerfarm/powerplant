import {post} from 'utils';

export function userSignupRequest(userData) {
  return dispatch => post('/api/users', userData);
}
