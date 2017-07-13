import {SET_TITLE} from './types';

export function setTitle(title) {
  console.log("Dispatching title change");
  const action = {
    type: SET_TITLE,
    title: title
  }
  console.log(action);
  return action;
}
