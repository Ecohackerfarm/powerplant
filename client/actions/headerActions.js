/**
 * @namespace headerActions
 * @memberof client.actions
 */

const { setTitle } = require('.');

/**
 * Request a title change
 * @param {String} title
 * @return {client.actions.setTitleAction}
 */
function setTitleRequest(title) {
	return setTitle(title);
}

module.exports = {
	setTitleRequest
};
