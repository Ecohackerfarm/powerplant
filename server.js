// import express
var express = require('express');
// build our express app
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pp_main');
mongoose.Promise = global.Promise;

var bodyParser = require('body-parser');

// set our port
var port = process.env.PORT || 8080;

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Setting up Firebase (would only need to run migration)

// can just use regular firebase
// var firebase = require("firebase");
// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyCKLggXck_1fxtoSn0uvjQ00gEapjLJDbM",
//   authDomain: "companion-planting-b56b5.firebaseapp.com",
//   databaseURL: "https://companion-planting-b56b5.firebaseio.com",
//   projectId: "companion-planting-b56b5",
//   storageBucket: "companion-planting-b56b5.appspot.com",
//   messagingSenderId: "158677284326"
// };
// var firebase = require('firebase');
// firebase.initializeApp(config);


// use external router files to organize the api better
require('./controllers/plants')(app);
require('./controllers/companions')(app);

app.listen(port, function(event) {
  console.log("Server running on port " + port);
});

// require('./migration/companion-migration')();
