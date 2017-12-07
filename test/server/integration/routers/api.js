import app from '/server/app.js';
import supertest from 'supertest';

const rootUrl = '/api';
const jsonType = 'application/json; charset=utf-8';
const request = supertest(app);

describe(rootUrl + '/*', () => {
	describe('GET', () => {
		it('should give JSON 404 for unknown route', () => {
			return request
				.get(rootUrl + '/fja93jf9w3jfsf.jf93jf-fj')
				.expect(404)
				.expect('Content-Type', jsonType);
		});
	});
});
