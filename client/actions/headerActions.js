/**
 * @namespace headerActions
 * @memberof client.actions
 */

import {SET_TITLE} from './types';

/**
 * Returns an action to make a title change
 * @param {String} title the new title which will be displayed
 * @return {client.actions.headerActions.SET_TITLE}
 */
export function setTitle(title) {
  const action = {
    type: SET_TITLE,
    title: title
  }
  return action;
}


/**
 * Pure action to set the title
 * @typedef {Object} SET_TITLE
 * @memberof client.actions.headerActions
 * @property {String} [type=SET_TITLE]
 * @property {String} title new title to be displayed
 */
