import { expect } from 'chai';
import app from '/server/app';
import { sendForm, randString } from '../routerHelpers';
import supertest from 'supertest';
import Location from '/server/models/location';
import User from '/server/models/user';
import Bed from '/server/models/bed';
import { user as testUser } from './users';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';

const rootUrl = '/api/beds';
const jsonType = 'application/json; charset=utf-8';
const request = supertest(app);

var locId;
var userId;
var token;
var bedId;

before(() => {
	// need to add a location and beds to our test user
	return User.find().byUsername(testUser.username).exec((err, { _id }) => {
		userId = _id.toString();
		token = jwt.sign(
			{
				id: userId,
				username: testUser.username,
				email: testUser.email
			},
			jwtSecret
		);
		return userId;
	}).then(userId => {
		return new Location({
			user: userId,
			name: 'test location'
		}).save((err, loc) => {
			locId = loc._id.toString();
			return new Bed({
				active_crops: [],
				past_crops: [],
				soil_type: 0,
				location: locId,
				user: userId
			}).save((err, bed) => {
				bedId = bed._id.toString();
				return new Bed({
					active_crops: [],
					past_crops: [],
					soil_type: 0,
					location: locId,
					user: userId
				}).save((err, bed) => {});
			});
		});
	});
});

describe(rootUrl + '/', () => {
	var newBed;
	before(() => {
		newBed = {
			active_crops: [],
			past_crops: [],
			soil_type: 0,
			location: locId,
			user: userId,
		};
	});
	describe('POST', () => {
		it('should 401 if not authenticated', () => {
			return sendForm(request.post(rootUrl + '/'), newBed).expect(401);
		});
		it('should create a new bed if authenticated', () => {
			return sendForm(request.post(rootUrl + '/'), newBed)
				.set('authorization', 'Bearer ' + token)
				.expect(201)
				.expect('Content-Type', jsonType)
				.then(res => {
					const bed = res.body;
					expect(bed).to.have.property('user').and.to.equal(userId);
					expect(bed).to.have.property('location').and.to.equal(locId);
				});
		});
		it('should update the beds array of the location', () => {
			return request
				.get('/api/locations/' + locId)
				.set('authorization', 'Bearer ' + token)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.have.property('beds').with.lengthOf(1);
				});
		});
	});
});

describe(rootUrl + '/:bedId', () => {
	describe('GET', () => {
		it('should 401 without authorization', function() {
			this.timeout(15000);
			const url = rootUrl + '/' + bedId;
			console.log(url);
			return request.get(url).expect(401);
		});
		it('should return bed with authorization', () => {
			return request
				.get(rootUrl + '/' + bedId)
				.set('authorization', 'Bearer ' + token)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.have.property('_id').and.to.equal(bedId);
					expect(res.body).to.have.property('soil_type').and.to.equal(0);
				});
		});
		it('should 404 with nonexistent', () => {
			const token = jwt.sign(
				{
					id: 'this is a made up user id',
					username: 'this is a made up username',
					email: 'this is a made up email'
				},
				jwtSecret
			);
			return request
				.get(rootUrl + '/' + bedId)
				.set('authorization', 'Bearer ' + token)
				.expect(404);
		});
	});
	describe('PUT', () => {
		it('should update the bed with proper authorization', () => {
			const changes = {
				soil_type: 1
			};
			return sendForm(request.put(rootUrl + '/' + bedId), changes)
				.set('authorization', 'Bearer ' + token)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.have.property('soil_type').and.to.equal(changes.soil_type);
				});
		});
		it('should not update with invalid data', () => {
			const changes = { soil_type: 100 };
			return sendForm(request.put(rootUrl + '/' + bedId), changes)
				.set('authorization', 'Bearer ' + token)
				.expect(400);
		});
	});
	describe('DELETE', () => {
		it('should delete a bed with authorization', () => {
			return request
				.delete(rootUrl + '/' + bedId)
				.set('authorization', 'Bearer ' + token)
				.expect(204);
		});
	});
});
