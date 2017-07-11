import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const props = ['username', 'password', 'email'];
export default function(user) {
  let errors = {};

  props.forEach(item => {
    if (Validator.isEmpty(user[item])) {
      errors[item] = 'This field is required';
    }
  });
  if (!Validator.isEmail(user.email)) {
    errors.email = "Email is invalid";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
}
