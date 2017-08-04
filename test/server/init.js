import mongoose from 'mongoose';
import { buildApp } from '/server/app';
import config from '/server/config';

before(() => {
  //TODO: Set up a test database! (pp_test)
  console.log('config.databaseUrl', config.databaseUrl)
  mongoose.connect(config.databaseUrl, err => {
		if (err) {
			console.log('ERROR connecting to database');
		} else {
			console.log('Connected to database');
		}
	});
	mongoose.Promise = global.Promise;

	buildApp(false); // disable webpack
});
