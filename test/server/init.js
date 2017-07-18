import mongoose from 'mongoose';
import {buildApp} from '/server/app';

before(() => {
  //TODO: Set up a test database! (pp_test)
  mongoose.connect('mongodb://localhost/pp_main');
  mongoose.Promise = global.Promise;
  console.log("Connected to database");

  buildApp(false); // disable webpack
});
