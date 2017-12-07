import 'babel-polyfill';
import mongoose from 'mongoose';
import { buildApp } from '/server/app';
import * as server from '/server/app';
import { Processor } from '/server/processor';

before(() => {
	//TODO: Set up a test database! (pp_test)
	console.log('server.databaseUrl', server.databaseUrl);
	mongoose.connect(server.databaseUrl, err => {
		if (err) {
			console.log('ERROR connecting to database');
		} else {
			console.log('Connected to database');
		}
	});
	mongoose.Promise = global.Promise;

	buildApp(false); // disable webpack
});

beforeEach(() => {
	server.processor = new Processor();
});
