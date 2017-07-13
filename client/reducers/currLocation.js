import {SET_CURRENT_LOCATION} from '/client/actions/types';

export const currLocation = (state=null, action) => {
  return action.location;
}
