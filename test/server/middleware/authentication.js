import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import User from '/server/models/user';
import { getAuthenticatedUser as auth } from '/server/middleware/authentication';

describe('authentication middleware', () => {
	describe('#getAuthenticatedUser()', () => {
		it('should 401 with no authentication header', done => {
			const req = {
				headers: {}
			};
			const res = {};
			const reqCopy = Object.assign({}, req);
			const resCopy = Object.assign({}, res);
			const next = err => {
				expect(err).to.have.property('status').and.to.equal(401);
				done();
			};
			auth(req, next);
		});
		it('should 401 with invalid authentication header', done => {
			const req = {
				headers: {
					authorization: "afjwafjaw 0fa9w3f'ag'a38)*GY$" //button mashing
				}
			};
			const res = {};
			const next = err => {
				expect(err).to.have.property('status').and.to.equal(401);
				done();
			};
			auth(req, next);
		});
		it('should 400 with invalid user id', done => {
			const badToken = jwt.sign(
				{
					id: 'blasjldfkas',
					username: 'noonehasthisusernameihope',
					email: 'FJ()WFJ(DXCVN)'
				},
				jwtSecret
			);
			const req = {
				headers: {
					authorization: 'Bearer ' + badToken
				}
			};
			const res = {};
			const next = err => {
				expect(err).to.have.property('status').and.to.equal(400);
				done();
			};
			auth(req, next);
		});
		it('should return User document with valid user', done => {
			User.findOne({}, (err, user) => {
				expect(err).to.be.null;
				return user;
			}).then(user => {
				const token = jwt.sign(
					{
						id: user._id,
						username: user.username,
						email: user.email
					},
					jwtSecret
				);
				const req = {
					headers: {
						authorization: 'Bearer ' + token
					}
				};
				const res = {};
				const next = err => {
					done();
				};
				console.log('auth');
				auth(req, next).then(actualUser => {
					console.log('then');
					console.log(actualUser);
					expect(actualUser).to.have.property('_id');
					expect(actualUser._id.toString()).to.equal(user._id.toString());
					done();
				});
			});
		});
	});
});
