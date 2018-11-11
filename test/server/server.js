const { assert, expect } = require('chai');
const { request } = require('./init.js');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const { JWT_SECRET } = require('../../secrets');
const {
	checkCropRelationship,
	sendForm,
	randString,
	allStrings,
	createTestCrop,
	createTestCropRelationship
} = require('./routerHelpers');
const Crop = require('../../server/models/crop');
const CropRelationship = require('../../server/models/crop-relationship');
const Location = require('../../server/models/location');
const User = require('../../server/models/user');
const { Types } = require('mongoose');

const jsonType = 'application/json; charset=utf-8';
const { ObjectId } = Types;
const user = {
	username: 'testUser',
	email: 'testEmail@email.com',
	password: 'testPassword'
};

describe('/api/*', () => {
	const rootUrl = '/api';
	
	describe('GET', () => {
		it('should give JSON 404 for unknown route', () => {
			return request
				.get(rootUrl + '/fja93jf9w3jfsf.jf93jf-fj')
				.expect(404)
				.expect('Content-Type', jsonType);
		});
	});
});

describe('/api/crop-relationships', () => {
	const rootUrl = '/api/crop-relationships';
	
	describe(rootUrl + '/', () => {
		const url = rootUrl + '/';
		describe('GET', () => {
			it('should return an array of relationships', function() {
				this.timeout(5000); // needed to leave as a non-arrow function so that 'this' reference above works
				return request
					.get('/api/get-all-crop-relationships/')
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body)
							.to.be.an('array')
							.and.to.have.length.above(0);
						res.body.forEach(checkCropRelationship);
					});
			});
		});
		describe('POST', () => {
			let crop0, crop1;
			before(() => {
				const cropData = {
					commonName: randString(),
					binomialName: 'Snozzberry'
				};
				return sendForm(request.post('/api/crops'), cropData).then(res => {
					crop0 = res.body._id.toString();
					return sendForm(request.post('/api/crops'), cropData).then(res => {
						crop1 = res.body._id.toString();
					});
				});
			});
			it('should create a new relationship with valid existing crop ids', () => {
				const newComp = {
					crop0: crop0,
					crop1: crop1,
					compatibility: -1
				};
				return sendForm(request.post(url), newComp).expect(201);
			});
			it('should 400 if trying to create a relationship that already exists', () => {
				const newComp = {
					crop0: crop1,
					crop1: crop0,
					compatibility: -1
				};
				return sendForm(request.post(url), newComp)
					.expect(400)
					.then(res => {
						expect(res.header).to.not.have.property('location');
					});
			});
			it('should 400 with nonexistent crop ids', () => {
				// TODO: This is a BIZARRE bug
				// when using a nonexistent but valid object id here, the error object gets printed to the console
				// i see no print statement in the entire project that prints an error object
				// figure out where this is coming from?
				const newComp = {
					crop0: ObjectId().toString(),
					crop1: ObjectId().toString(),
					compatibility: false
				};
				return sendForm(request.post(url), newComp).expect(400);
			});
			it('should 400 with invalid crop ids', () => {
				const newComp = {
					crop0: 'ja;fsifa093',
					crop1: 'jf930wjf93wf',
					compatiblity: true
				};
				return sendForm(request.post(url), newComp).expect(400);
			});
		});
	});

	describe(rootUrl + '/:id', () => {
		const url = rootUrl;
		let validId;
		let validCompatibility;
		before(done => {
			createTestCropRelationship(comp => {
				validId = comp._id.toString();
				validCompatibility = comp.compatibility;
				done();
			});
		});
		describe('GET', () => {
			it('should 400 for a malformed id', () => {
				return request.get(url + '/a').expect(400);
			});
			it('should 404 for a nonexistent id', () => {
				return request.get(url + '/' + ObjectId().toString()).expect(404);
			});
			it('should return the correct companionship for a valid id', () => {
				return request
					.get(url + '/' + validId)
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body)
							.to.have.property('_id')
							.and.to.equal(validId);
					});
			});
		});
		describe('PUT', () => {
			it('should modify the specified fields of a valid id', () => {
				const changes = {
					compatibility: validCompatibility > 0 ? -1 : 3
				};
				return sendForm(request.put(url + '/' + validId), changes)
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body)
							.to.have.property('_id')
							.and.to.equal(validId);
						expect(res.body)
							.to.have.property('compatibility')
							.and.to.equal(changes.compatibility);
					});
			});
			it('should 404 on nonexistent id', () => {
				return sendForm(
					request.put(url + '/' + ObjectId().toString()),
					{}
				).expect(404);
			});
			it('should 400 on invalid id', () => {
				return sendForm(request.put(url + '/afw2j'), {}).expect(400);
			});
		});
		describe('DELETE', () => {
			it('should delete a valid relationship', () => {
				return request
					.delete(url + '/' + validId)
					.expect(204)
					.then(res => {
						return CropRelationship.findById(validId, (err, comp) => {
							expect(comp).to.be.null;
						});
					});
			});
		});
	});
});

describe('/api/crops', () => {
	const rootUrl = '/api/crops';
	
	describe(rootUrl + '/', () => {
		let count;
		before(done => {
			createTestCrop(crop => {
				Crop.count({}, (err, num) => {
					count = num;
					done();
				});
			});
		});
		describe('GET', () => {
			it('should 400 with no arguments', () => {
				return request.get('/api/get-crops-by-name').expect(400);
			});
			it('should return crops matching a query string', () => {
				return request
					.get('/api/get-crops-by-name' + '?name=test&index=0&length=30')
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body).to.have.length.above(0);
						res.body.forEach(apple => {
							expect(apple.commonName + apple.binomialName).to.include('test');
						});
					});
			});
			it('should return no crops for gibberish query string', () => {
				return request
					.get('/api/get-crops-by-name' + '?name=jf93 FJ(Fiojs&index=0&length=30')
					.expect(200)
					.expect('Content-Type', jsonType)
					.expect([]);
			});
		});
		describe('POST', () => {
			const crop = {
				commonName: "Simon's crop for testing",
				binomialName: "Simon's crop for testing"
			};
			it('should create new crop = require(just binomial name', () => {
				return sendForm(request.post(rootUrl), crop)
					.expect(201)
					.then(res => {
						expect(res.body).to.have.property('_id');
						expect(res.body)
							.to.have.property('binomialName')
							.and.to.equal(crop.binomialName);
					});
			});
			it('should 400 missing name or display', () => {
				delete crop.binomialName;
				return sendForm(request.post(rootUrl), crop).expect(400);
			});
		});
	});

	describe(rootUrl + '/:cropId', () => {
		let testId;
		let compId;
		before(done => {
			createTestCropRelationship(comp => {
				testId = comp.crop0._id.toString();
				compId = comp._id.toString();
				done();
			});
		});
		describe('GET', () => {
			it('should 400 a bad id', () => {
				return request
					.get(rootUrl + '/a9jfw0aw903j j (JF) fjw')
					.expect(400)
					.expect('Content-Type', jsonType);
			});
			it('should 404 a valid but nonexistent crop id', () => {
				return request
					.get(rootUrl + '/' + ObjectId().toString())
					.expect(404)
					.expect('Content-Type', jsonType);
			});
			it('should return the specified crop', () => {
				return request
					.get(rootUrl + '/' + testId)
					.expect(200)
					.then(res => {
						const test = res.body;
						expect(test)
							.to.have.property('commonName')
							.and.to.match(RegExp('test', 'i'));
					});
			});
		});
		describe('PUT', () => {
			it('should make the specified valid changes', () => {
				const changes = {
					commonName: randString()
				};
				return sendForm(request.put(rootUrl + '/' + testId), changes)
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						const newTest = res.body;
						expect(newTest)
							.to.have.property('commonName')
							.and.to.equal(changes.commonName);
					});
			});
			it('should not effect invalid field changes', () => {
				const changes = { blahblah: randString() };
				return sendForm(request.put(rootUrl + '/' + testId), changes)
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body).to.not.have.property('blahblah');
					});
			});
			it('should not effect ID changes', () => {
				const changes = { _id: ObjectId().toString() };
				return sendForm(request.put(rootUrl + '/' + testId), changes)
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body)
							.to.have.property('_id')
							.and.to.equal(testId);
					});
			});
			it('should not allow invalid data changes', () => {
				const changes = {
					commonName: { firstname: 'firstname', lastname: 'lastname' }
				};
				return sendForm(request.put(rootUrl + '/' + testId), changes).expect(400);
			});
		});
		describe('DELETE', () => {
			it('should delete a valid crop', () => {
				return request.delete(rootUrl + '/' + testId).expect(204);
			});
			it('should delete all associated relationships', () => {
				return request.get('/api/crop-relationships/' + compId).expect(404);
			});
		});
	});
});

describe('/api/locations', () => {
	const testUser = user;
	const rootUrl = '/api/locations';

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
});

describe('/api/users', () => {
	const rootUrl = '/api/users';

	let userId;
	let token;

	function buildToken(id) {
		token = jwt.sign(
			{
				id,
				username: user.username,
				email: user.email
			},
			JWT_SECRET
		);
	}

	// creating/fetching the test user before everything
	// using the done callback because it kept throwing an error
	// if i return a promise and the user already exists
	before(done => {
		new User(user).save((err, newUser) => {
			if (err) {
				User.find()
					.byUsername(user.username)
					.exec((err, { _id }) => {
						userId = _id.toString();
						user._id = _id;
						buildToken(userId);
						done();
					});
			} else {
				userId = newUser._id.toString();
				buildToken(userId);
				done();
			}
		});
	});

	describe(rootUrl + '/', () => {
		before(() => {
			return User.find()
				.byUsername('testUser1')
				.remove();
		});
		describe('POST', () => {
			const user = {
				username: 'testUser1',
				email: 'testemail1@email.com',
				password: 'testPassword'
			};
			it('should create a user with valid data and return id', () => {
				return sendForm(request.post(rootUrl + '/'), user)
					.expect(201)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body).to.have.property('_id');
					});
			});
			it('should 400 on duplicate user', () => {
				return sendForm(request.post(rootUrl + '/'), user).expect(400);
			});
			it('should 400 a user with missing data', () => {
				const user = {
					email: 'test@email.com',
					password: 'testPassword'
				};
				return sendForm(request.post(rootUrl + '/'), user).expect(400);
			});
			it('should 400 a user with invalid data', () => {
				const user = {
					username: 'validUser',
					email: 'invalidemail',
					password: 'validPassword'
				};
				return sendForm(request.post(rootUrl + '/'), user).expect(400);
			});
		});
	});

	describe(rootUrl + '/:userId', () => {
		describe('GET', () => {
			it('should return correct user for valid id', function() {
				return request
					.get(rootUrl + '/' + userId)
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body)
							.to.have.property('username')
							.and.to.equal(user.username);
						expect(res.body)
							.to.have.property('_id')
							.and.to.equal(userId);
					});
			});
			it('should not return password or email', () => {
				return request
					.get(rootUrl + '/' + userId)
					.expect(200)
					.expect('Content-Type', jsonType)
					.then(res => {
						expect(res.body).not.to.have.property('password');
						expect(res.body).not.to.have.property('email');
					});
			});
		});
	});

	describe(rootUrl + '/:userId/locations', () => {
		describe('GET', () => {
			it('should 401 if not authenticated', () => {
				return request.get('/api/get-locations').expect(401);
			});
			it('should return locations if authenticated', () => {
				return request
					.get('/api/get-locations')
					.set('authorization', 'Bearer ' + token)
					.expect(200)
					.then(res => {
						assert.equal(res.body[0].name, 'my location 1');
					});
			});
			it('should not return locations if invalid authentication', () => {
				return request
					.get('/api/get-locations')
					.set('authorization', 'Bearer ' + token + 'f)(#)')
					.expect(401);
			});
			// TODO: test if a user is authenticated but accessing another users locations
		});
	});
});

describe('/api/login', () => {
	const rootUrl = '/api/login';
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
});
