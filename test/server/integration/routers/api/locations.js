const { expect } = require('chai');
const { sendForm, randString } = require('../routerHelpers');
const Location = require('../../../../../server/models/location');
const User = require('../../../../../server/models/user');
const { user } = require('./users');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../../../secrets');
const { request } = require('../../../init.js');

const testUser = user;
const rootUrl = '/api/locations';
const jsonType = 'application/json; charset=utf-8';

let locId;
let neverRemovedLocationId;
let userId;
let token;

before(() => {
	// need to add a location to our test user
	return User.find()
		.byUsername(testUser.username).exec()
		.then(({ _id }) => {
			userId = _id.toString();
			token = jwt.sign(
				{
					id: userId,
					username: testUser.username,
					email: testUser.email
				},
				JWT_SECRET
			);
			return userId;
		})
		.then(userId => {
			return new Location({
				user: userId,
				name: 'test location'
			}).save((err, loc) => {
				locId = loc._id.toString();
				return new Location({
					user: userId,
					name: 'another test location'
				}).save((err, loc) => {
					neverRemovedLocationId = loc._id.toString();
				});
			});
		});
});

describe(rootUrl + '/', () => {
	let newLoc;
	before(() => {
		newLoc = {
			user: userId,
			name: 'my location 1',
			loc: { address: '', coordinates: [12.2, 12.1] },
			beds: [
				{ name: 'test bed 0', soil_type: 0 },
				{ name: 'test bed 1', soil_type: 1 }
			]
		};
	});
	describe('POST', () => {
		it('should 401 if not authenticated', () => {
			return sendForm(request.post(rootUrl + '/'), newLoc).expect(401);
		});
		it('should create a new location if authenticated', () => {
			return sendForm(request.post(rootUrl + '/'), newLoc)
				.set('authorization', 'Bearer ' + token)
				.expect(201)
				.expect('Content-Type', jsonType)
				.then(res => {
					const loc = res.body;
					expect(loc)
						.to.have.property('user')
						.and.to.equal(userId);
				});
		});
	});
});

describe(rootUrl + '/:locId', () => {
	describe('GET', () => {
		it('should 401 without authorization', function() {
			this.timeout(15000);
			const url = rootUrl + '/' + locId;
			console.log(url);
			return request.get(url).expect(401);
		});
		it('should return location with authorization', () => {
			return request
				.get(rootUrl + '/' + locId)
				.set('authorization', 'Bearer ' + token)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body)
						.to.have.property('_id')
						.and.to.equal(locId);
				});
		});
		it('should 400 with invalid id', () => {
			const token = jwt.sign(
				{
					id: 'this is a made up user id',
					username: 'this is a made up username',
					email: 'this is a made up email'
				},
				JWT_SECRET
			);
			return request
				.get(rootUrl + '/' + locId)
				.set('authorization', 'Bearer ' + token)
				.expect(400);
		});
	});
	describe('PUT', () => {
		it('should update the location with proper authorization', () => {
			const changes = {
				name: randString(),
				loc: { address: randString, coordinates: [1, 1] }
			};
			return sendForm(request.put(rootUrl + '/' + locId), changes)
				.set('authorization', 'Bearer ' + token)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body)
						.to.have.property('name')
						.and.to.equal(changes.name);
				});
		});
		it('should not update with invalid data', () => {
			const changes = { name: { a: 1 } };
			return sendForm(request.put(rootUrl + '/' + locId), changes)
				.set('authorization', 'Bearer ' + token)
				.expect(400);
		});
	});
	describe('DELETE', () => {
		it('should delete a location with authorization', () => {
			return request
				.delete(rootUrl + '/' + locId)
				.set('authorization', 'Bearer ' + token)
				.expect(204);
		});
	});
});
