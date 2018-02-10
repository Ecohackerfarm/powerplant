const Validator = require('validator');
const isEmpty = require('lodash.isempty');

function locationValidation(location) {
	let errors = {};

	if (Validator.isEmpty(location.loc.coordinates.toString())) {
		errors['loc'] = {
			coordinates: 'Invalid location'
		};
	}

	if (Validator.isEmpty(location.name)) {
		errors['name'] = 'This field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

module.exports = locationValidation;
