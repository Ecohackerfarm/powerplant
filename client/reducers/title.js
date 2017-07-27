import {SET_TITLE, LOGOUT} from '../actions/types';

export const defaultState = 'powerplant';

export const title = (state=defaultState, action) => {
  switch (action.type) {
    case SET_TITLE:
      return action.title;
    default:
      return state;
  }
}
