import {SET_CURRENT_LOCATION} from '/client/actions/types';
import * as types from '/client/actions/types';
export const currLocation = (state=null, action) => {
  switch (action.type) {
    case types.SET_CURRENT_LOCATION:
      return action.location;
    default:
      return state;
  }
}
