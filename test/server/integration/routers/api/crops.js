const { expect } = require('chai');
const { request } = require('../../../init.js');
const {
	sendForm,
	randString,
	allStrings,
	createTestCrop,
	createTestCropRelationship
} = require('../routerHelpers');
const Crop = require('../../../../../server/models/crop');
const { Types } = require('mongoose');

const rootUrl = '/api/crops';
const jsonType = 'application/json; charset=utf-8';
const { ObjectId } = Types;

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
