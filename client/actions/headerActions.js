import {SET_TITLE} from './types';

// Dispatches a title change, which gets propogated to the header
export function setTitle(title) {
  const action = {
    type: SET_TITLE,
    title: title
  }
  return action;
}
