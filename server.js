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


// use external router files to organize the api better
require('./controllers/plants')(app);
require('./controllers/companions')(app);

app.listen(port, function(event) {
  console.log("Server running on port " + port);
});

require('./migration/full-migration')();
