import mongoose from 'mongoose';
import {buildApp} from '/server/app';

before(() => {
  //TODO: Set up a test database! (pp_test)
  mongoose.connect('mongodb://192.168.99.100:27017/pp_main', (err) => {
    if (err) {
      console.log("ERROR connecting to database");
    }
    else {
      console.log("Connected to database");
    }
  });
  mongoose.Promise = global.Promise;

  buildApp(false); // disable webpack
});
