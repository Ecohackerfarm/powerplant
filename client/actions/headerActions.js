/**
 * @namespace headerActions
 * @memberof client.actions
 */

import {setTitle} from '.';

/**
 * Request a title change
 * @param {String} title
 * @return {client.actions.setTitleAction}
 */
export function setTitleRequest(title) {
  return setTitle(title);
}
