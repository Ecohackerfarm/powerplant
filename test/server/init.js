import supertest from 'supertest';
import { startServer } from '/server/server';

before(() => {
	// TODO: Set up a test database! (pp_test)
	app = startServer(true);
	request = supertest(app);
});

beforeEach(() => {
//	server.processor = new Processor();
});

export let app;
export let request;
