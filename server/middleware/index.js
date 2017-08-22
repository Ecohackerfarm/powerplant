/**
 * Express middleware functions
 * @namespace middleware
 * @memberof server
 */

/**
 * Returns an Express middleware function for setting the req.ids property that
 * is used to carry document IDs to other middleware functions.
 *
 * @see data-validation.idValidator
 *
 * @param {Function} getIds Forms the ID array given the req object
 * @return {Function}
 */
export function setIds(getIds) {
	return (req, res, next) => {
		req.ids = getIds(req);
		next();
	};
}
