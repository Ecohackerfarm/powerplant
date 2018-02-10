const { request } = require('../../init.js');

const rootUrl = '/api';
const jsonType = 'application/json; charset=utf-8';

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
