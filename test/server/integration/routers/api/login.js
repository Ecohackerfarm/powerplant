const { expect } = require('chai');
const { sendForm } = require('../routerHelpers');
const { user } = require('./users');
const jwtDecode = require('jwt-decode');
const { request } = require('../../../init.js');

const rootUrl = '/api/login';
const jsonType = 'application/json; charset=utf-8';

const testLogin = {
	username: user.username,
	password: user.password
};

describe(rootUrl + '/', () => {
	describe('POST', () => {
		it('should send jwt with correct credentials', () => {
			return sendForm(request.post(rootUrl + '/'), testLogin)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.have.property('token');
					const decoded = jwtDecode(res.body.token);
					expect(decoded)
						.to.have.property('username')
						.and.to.equal(user.username);
					expect(decoded)
						.to.have.property('email')
						.and.to.equal(user.email);
					expect(decoded)
						.to.have.property('id')
						.and.to.equal(user._id.toString());
					expect(decoded).not.to.have.property('password');
				});
		});
	});
});
