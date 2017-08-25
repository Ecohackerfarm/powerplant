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

/**
 * Returns an Express middleware function that updates the given document
 * to the database. The document must already exist before calling this
 * function.
 *
 * @param {String} documentProperty
 * @return {Function}
 */
export function updateDocument(documentProperty) {
	return (req, res, next) => {
		const document = req[documentProperty];
		delete req.body._id; // Don't try to update ID
		Object.assign(document, req.body);
		/*
		 * TODO Create more tests to specify the functioning. Another way to update
		 * a document: Model.findByIdAndUpdate(id, update, options, callback).
		 */
		document.save((err, newDocument) => {
			if (err) {
				console.log('Got errors');
				console.log(err);
				next({ status: 400, errors: err.errors, message: err._message });
			} else {
				res.status(200).json(newDocument);
			}
		});
	};
}

/**
 * Returns an Express middleware function that deletes the given document
 * from the database.
 *
 * @param {String} documentProperty
 * @param {Function}
 */
export function deleteDocument(documentProperty) {
	return (req, res, next) => {
		const document = req[documentProperty];
		document.remove(err => {
			if (err) {
				next({ status: 400, errors: err.errors, message: err._message });
			} else {
				/*
				 * RFC 2616: A successful response SHOULD be 204 (No Content) if the
				 * action has been enacted but the response does not include an entity.
				 */
				res.status(204).json();
			}
		});
	};
}

/**
 * Returns an Express middleware function that renders the result object when
 * given the document to be rendered.
 *
 * @param {String} documentProperty
 * @return {Function}
 */
export function renderResult(documentProperty) {
	return (req, res, next) => {
		res.status(200).json(req[documentProperty]);
	};
}
