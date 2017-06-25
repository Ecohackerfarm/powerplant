var express = require('express');

// this is where our error handling middleware for the api will go
// error responses should look different if they're in the api vs. in the front end
// so we want separate middleware for it

var router = express.Router();

// assume a base url of '/api'
router.use('/crops', require('./api/crops'));
router.use('/companionships', require('./api/companionships'));

// our error handler middleware function
router.use(function(err, req, res, next) {
  if (err) {
    res.status(err.status).json(err);
  }
  else {
    next();
  }
});

router.get('*', function(req, res, next) {
  next({status: 404, message: "No such route"});
});

module.exports = router;
