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

/**
 * Returns an Express middleware function for assigning the single document
 * from the given document array to the given property, to carry it to other
 * middleware functions.
 *
 * @param {String} documentProperty
 * @param {String} documentArrayProperty
 * @return {Function}
 */
export function assignSingleDocument(documentProperty, documentArrayProperty) {
	return (req, res, next) => {
		req[documentProperty] = req[documentArrayProperty][0];
		next();
	};
}
