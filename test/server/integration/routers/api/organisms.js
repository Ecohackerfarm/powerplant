import { expect } from 'chai';
import app from '/server/app';
import {
	sendForm,
	randString,
	allStrings,
	createTestCrop,
	createTestCompanionship
} from '../routerHelpers';
import supertest from 'supertest';
import Organism from '/server/models/organism';
import { Types } from 'mongoose';

const rootUrl = '/api/organisms';
const jsonType = 'application/json; charset=utf-8';
const { ObjectId } = Types;
const request = supertest(app);

describe(rootUrl + '/', () => {
	let count;
	before(done => {
		createTestCrop(crop => {
			Organism.count({}, (err, num) => {
				count = num;
				done();
			});
		});
	});
	describe('GET', () => {
		it('should return all organisms with no arguments', () => {
			return request
				.get('/api/get-organisms-by-name')
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.have.length(count);
				});
		});
		it('should return organisms matching a query string', () => {
			return request
				.get('/api/get-organisms-by-name' + '?name=test')
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.have.length.above(0);
					res.body.forEach(apple => {
						expect(apple.commonName + apple.binomialName).to.include('test');
					});
				});
		});
		it('should return no organisms for gibberish query string', () => {
			return request
				.get('/api/get-organisms-by-name' + '?name=jf93 FJ(Fiojs')
				.expect(200)
				.expect('Content-Type', jsonType)
				.expect([]);
		});
	});
	describe('POST', () => {
		const crop = {
			binomialName: "Simon's crop for testing"
		};
		it('should create new crop from just binomial name', () => {
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

describe(rootUrl + '/:organismId', () => {
	let testId;
	let compId;
	before(done => {
		createTestCompanionship(comp => {
			testId = comp.crop1._id.toString();
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
		it('should 404 a valid but nonexistent organism id', () => {
			return request
				.get(rootUrl + '/' + ObjectId().toString())
				.expect(404)
				.expect('Content-Type', jsonType);
		});
		it('should return the specified organism', () => {
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
		it('should delete a valid organism', () => {
			return request.delete(rootUrl + '/' + testId).expect(204);
		});
		it('should delete all associated companionships', () => {
			return request.get('/api/companionships/' + compId).expect(404);
		});
	});
});

describe('/api/get-companionships-by-organism', () => {
	let testId;
	before(done => {
		createTestCompanionship(comp => {
			testId = comp.crop1._id.toString();
			done();
		});
	});
	describe('GET', () => {
		it('should fetch an array', () => {
			return request
				.get('/api/get-companionships-by-organism/' + testId)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.have.length.above(0);
				});
		});
		it('should populate companionships', () => {
			return request
				.get('/api/get-companionships-by-organism/' + testId)
				.expect(200)
				.then(res => {
					res.body.forEach(item => {
						expect(item).to.contain.all.keys('crop1', 'crop2', 'compatibility');
					});
				});
		});
		it('should only fetch matching companionships', () => {
			return request
				.get('/api/get-companionships-by-organism/' + testId)
				.expect(200)
				.then(res => {
					res.body.forEach(item => {
						expect(item).to.satisfy(item => {
							return item.crop1 === testId || item.crop2 === testId;
						});
					});
				});
		});
	});
});

describe(rootUrl + '/:cropId1/companionships/:cropId2', () => {
	let appleId;
	let testId;
	before(() => {
		return request
			.get('/api/get-organisms-by-name' + '?name=apple')
			.then(res => {
				appleId = res.body[0]._id;
				return request
					.get('/api/get-organisms-by-name' + '?name=test')
					.then(res => {
						testId = res.body[0]._id;
					});
			});
	});
	describe('GET', () => {
		it('should provide proper location on existing companionship', () => {
			return request
				.get('/api/get-companionship/' + appleId + '/' + appleId)
				.expect(303)
				.then(res => {
					return request
						.get(res.header.location)
						.expect(200)
						.then(res => {
							const c = res.body;
							expect(c).to.contain.all.keys('crop1', 'crop2', 'compatibility');
							expect(c).to.satisfy(c => {
								return c.crop1._id === appleId && c.crop2._id === appleId;
							});
						});
				});
		});
		it('should response 204 on existing crops but nonexistent companionship', () => {
			return request
				.get('/api/get-companionship/' + appleId + '/' + testId)
				.expect(204);
		});
	});
});
