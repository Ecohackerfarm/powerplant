import * as type from './actions/types';

const initialState = {
  title: "powerplant"
}

export default function(state=initialState, action={}) {
  switch (action.type) {
    case type.SET_TITLE:
      return Object.assign({}, state, {
        title: action.title
      });
    default:
      return state;
  }
}
