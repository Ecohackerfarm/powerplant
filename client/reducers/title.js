import * as types from '../actions/types';

export const title = (state='powerplant', action) => {
  switch (action.type) {
    case types.SET_TITLE:
      return action.title;
    default:
      return state;
  }
}
