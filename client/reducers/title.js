import {SET_TITLE, LOGOUT} from '../actions/types';

const defaultState = 'powerplant';

export const title = (state=defaultState, action) => {
  switch (action.type) {
    case SET_TITLE:
      return action.title;
    case LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
