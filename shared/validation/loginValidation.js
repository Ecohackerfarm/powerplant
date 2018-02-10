const Validator = require('validator');
const isEmpty = require('lodash.isempty');

const props = ['username', 'password'];
function loginValidation(user) {
	let errors = {};

	props.forEach(item => {
		if (!(item in user) || Validator.isEmpty(user[item])) {
			errors[item] = 'This field is required';
		}
	});

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

module.exports = loginValidation;
