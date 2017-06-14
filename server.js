// import express
var express = require('express');
// build our express app
var app = express();

// set our port
var port = process.env.PORT || 8080;

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// Setting up Firebase

// For now, we don't need admin priviledges, since we are only retrieving info
// Leaving this here just in case we need it in the future
// var admin = require("firebase-admin");
// var serviceAccount = require("../service_account.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://companion-planting-b56b5.firebaseio.com"
// });

// can just use regular firebase
var firebase = require("firebase");
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCKLggXck_1fxtoSn0uvjQ00gEapjLJDbM",
  authDomain: "companion-planting-b56b5.firebaseapp.com",
  databaseURL: "https://companion-planting-b56b5.firebaseio.com",
  projectId: "companion-planting-b56b5",
  storageBucket: "companion-planting-b56b5.appspot.com",
  messagingSenderId: "158677284326"
};
firebase.initializeApp(config);


// use external router files to organize the api better
// pass in reference to firebase
require('./routers/plants')(app, firebase.database());

app.listen(port, function(event) {
  console.log("Server running on port " + port);
})
