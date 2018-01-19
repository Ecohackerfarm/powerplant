import 'babel-polyfill';
import mongoose from 'mongoose';
import { buildApp } from '/server/app';
import * as server from '/server/app';
import { Processor } from '/server/processor';
import {
	DATABASE_HOST,
	DATABASE_DB,
	DATABASE_PROTOCOLL
} from '/secrets.js';

before(() => {
	//TODO: Set up a test database! (pp_test)
	const databaseUrl = DATABASE_PROTOCOLL + DATABASE_HOST + '/' + DATABASE_DB;
	console.log('databaseUrl', databaseUrl);
	mongoose.connect(databaseUrl, err => {
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
