import { expect } from 'chai';
import app from '/server/app';
import supertest from 'supertest';
import {
	checkCompanionship,
	sendForm,
	randString,
	createTestCompanionship
} from '../routerHelpers';
import Companionship from '/server/models/companionship';
import { Types } from 'mongoose';

const { ObjectId } = Types;
const rootUrl = '/api/companionships';
const jsonType = 'application/json; charset=utf-8';
const request = supertest(app);

describe(rootUrl + '/', () => {
	const url = rootUrl + '/';
	describe('GET', () => {
		it('should return an array of companionships', function() {
			this.timeout(5000); // needed to leave as a non-arrow function so that 'this' reference above works
			return request
				.get('/api/get-all-companionships/')
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(res.body).to.be.an('array').and.to.have.length.above(0);
					res.body.forEach(checkCompanionship);
				});
		});
	});
	describe('POST', () => {
		let crop1, crop2;
		before(() => {
			const organismData = {
				commonName: randString(),
				binomialName: 'Snozzberry'
			};
			return sendForm(request.post('/api/organisms'), organismData).then(res => {
				crop1 = res.body._id.toString();
				return sendForm(request.post('/api/organisms'), organismData).then(res => {
					crop2 = res.body._id.toString();
				});
			});
		});
		it('should create a new companionship with valid existing crop ids', () => {
			const newComp = {
				crop1: crop1,
				crop2: crop2,
				compatibility: -1
			};
			return sendForm(request.post(url), newComp).expect(201);
		});
		it('should 400 if trying to create a companionship that already exists', () => {
			const newComp = {
				crop1: crop2,
				crop2: crop1,
				compatibility: -1
			};
			return sendForm(request.post(url), newComp).expect(400).then(res => {
				expect(res.header).to.not.have.property('location');
			});
		});
		it('should 400 with nonexistent crop ids', () => {
			// TODO: This is a BIZARRE bug
			// when using a nonexistent but valid object id here, the error object gets printed to the console
			// i see no print statement in the entire project that prints an error object
			// figure out where this is coming from?
			const newComp = {
				crop1: ObjectId().toString(),
				crop2: ObjectId().toString(),
				compatibility: false
			};
			return sendForm(request.post(url), newComp).expect(400);
		});
		it('should 400 with invalid crop ids', () => {
			const newComp = {
				crop1: 'ja;fsifa093',
				crop2: 'jf930wjf93wf',
				compatiblity: true
			};
			return sendForm(request.post(url), newComp).expect(400);
		});
	});
});

describe('/api/get-companionship-scores', () => {
	const url = '/api/get-companionship-scores';
	describe('GET', () => {
		let appleId, potatoId, beanId;
		before(() => {
			// fetching 3 crops
			const cropUrl = '/api/get-organisms-by-name?name=';
			return request.get(cropUrl + 'apple').then(appleRes => {
				appleId = appleRes.body[0]._id;
				return request.get(cropUrl + 'potato').then(potatoRes => {
					potatoId = potatoRes.body[0]._id;
					return request.get(cropUrl + 'bean').then(beanRes => {
						beanId = beanRes.body[0]._id;
					});
				});
			});
		});
		it('should 400 with no query', () => {
			return request.get(url).expect(400);
		});
		it('should return numerical scores with all valid organism ids', () => {
			return request
				.get(url + '?id=' + appleId + ',' + potatoId + ',' + beanId)
				.expect(200)
				.expect('Content-Type', jsonType)
				.then(res => {
					expect(Object.keys(res.body)).to.have.length.above(0);
					for (let id in res.body) {
						expect(res.body[id]).to.be.within(-1, 1);
					}
				});
		});
		it('should 400 if there is a malformed organism id', () => {
			return request
				.get(url + '?id=' + appleId + ',fa3j9w0f a0f9jwf')
				.expect(400);
		});
		it('should 400 if there is a nonexistent organism id', () => {
			return request
				.get(url + '?id=' + appleId + ',' + ObjectId().toString())
				.expect(400);
		});
	});
});

describe(rootUrl + '/:id', () => {
	const url = rootUrl;
	let validId;
	let validCompatibility;
	before(done => {
		createTestCompanionship(comp => {
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
					expect(res.body).to.have.property('_id').and.to.equal(validId);
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
					expect(res.body).to.have.property('_id').and.to.equal(validId);
					expect(res.body).to.have
						.property('compatibility')
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
		it('should delete a valid companionship', () => {
			return request.delete(url + '/' + validId).expect(204).then(res => {
				return Companionship.findById(validId, (err, comp) => {
					expect(comp).to.be.null;
				});
			});
		});
	});
});
