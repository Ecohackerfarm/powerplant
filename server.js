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


// set up our routers
app.use('/api', require('./routers/api'));

// 404 handler
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

// error handling middleware
app.use(function(err, req, res, next) {
  if (err.status !== 404) {
    return next();
  }
  else {
    res.send(err.message || "Content not found");
  }
});

app.listen(port, function(event) {
  console.log("Server running on port " + port);
});
