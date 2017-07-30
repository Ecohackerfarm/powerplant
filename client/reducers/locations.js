import {ADD_LOCATION, SET_LOCATIONS, EDIT_LOCATION, DELETE_LOCATION, LOGOUT} from '/client/actions/types';

export const defaultState = [];

export const locations = (state=defaultState, action) => {
  switch (action.type) {
    case SET_LOCATIONS:
      return action.locations;
    case ADD_LOCATION:
      return state.concat(action.location);
    case EDIT_LOCATION: {
      const index = state.findIndex(item => item._id === action.id)
      const newLocation = Object.assign({}, state[index], action.location);
      return state.slice(0, index).concat(newLocation, state.slice(index + 1));
    }
    case DELETE_LOCATION: {
      const index = state.findIndex(item => item._id === action.id)
      return state.slice(0, index).concat(state.slice(index + 1));
    }
    case LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
