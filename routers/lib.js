var express = require('express');

var router = express.Router();

// error handling middleware
router.use(function(err, req, res, next) {
  if (err.status !== 404) {
    return next();
  }
  else {
    res.send(err.message || "Content not found");
    // custom 404 page goes here
  }
});

// 404 handler
router.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

module.exports = router;
