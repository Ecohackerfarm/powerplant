var express = require('express');

// this is where our error handling middleware for the api will go
// error responses should look different if they're in the api vs. in the front end
// so we want separate middleware for it

var router = express.Router();

// adding headers to allow cross-origin requests
// this means it's a publicly available API!
router.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// assume a base url of '/api'
router.use('/crops', require('./api/crops'));
router.use('/companionships', require('./api/companionships'));

router.get('*', function(req, res, next) {
  next({status: 404, message: "No such route"});
});

// our error handler middleware function
router.use(function(err, req, res, next) {
  if (err) {
    res.status(err.status).json(err);
  }
  else {
    next();
  }
});

module.exports = router;
