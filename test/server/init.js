const supertest = require('supertest');
const { startServer } = require('../../server/server');

const app = startServer(true);
const request = supertest(app);

module.exports = {
	app,
	request
};
