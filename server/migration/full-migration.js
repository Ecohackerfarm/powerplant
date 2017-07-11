// Setting up Firebase (would only need to run migration)

// can just use regular firebase
import firebase from "firebase";
import mongoose from 'mongoose';

// initialize mongo
mongoose.connect('mongodb://localhost/pp_main');
mongoose.Promise = global.Promise;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCKLggXck_1fxtoSn0uvjQ00gEapjLJDbM",
  authDomain: "companion-planting-b56b5.firebaseapp.com",
  databaseURL: "https://companion-planting-b56b5.firebaseio.com",
  projectId: "companion-planting-b56b5",
  storageBucket: "companion-planting-b56b5.appspot.com",
  messagingSenderId: "158677284326"
};
import firebase from 'firebase';
firebase.initializeApp(config);

console.log("Beginning migration");
require('./crop-migration.js')();
