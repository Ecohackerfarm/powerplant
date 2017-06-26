// import express
var express = require('express');
// build our express app
var app = express();

var bodyParser = require('body-parser');


// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
// set up our routers
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/lib'));

module.exports = app;
