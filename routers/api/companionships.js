var express = require('express');
var Companionship = require('../../models/companionship');
var Helper = require('../../helpers/data_validation');

var router = express.Router();

// All routes have the base route: /companionships

router.route('/scores')
  .all(function(req, res, next) {
    req.ids = (req.query.id || "").split(",");
    next();
  },
  Helper.idValidator,
  Helper.fetchCropsWithCompanionships)
  .get(function(req, res, next) {
    var crops = req.crops;
    var companionships = crops.map(function(crop) {
      return crop.companionships;
    });
    var ids = req.ids;
    var scores = Helper.getCompanionshipScores(companionships, ids);
    res.json(scores);
  });

router.route('/')
  .get(function(req, res) {
    // get all combinations
    Companionship.find({}, function(err, result) {
      res.json(result);
    });
  })
  .post(function(req, res, next) {
    // add a new combination
    new Companionship(req.body).save(function(err, combo) {
      if (err) {
        err.status = 500;
        next(err);
      }
      else {
        res.location('/api/companionships/' + combo._id);
        res.status(201, combo);
      }
    });
  });

router.route('/:id')
  .all(function(req, res, next) {
    // storing the id in the request for idValidator
    req.ids = [req.params.id];
    next();
  },
  Helper.idValidator, // validate id (sends 400 if malformed id)
  Helper.fetchCompanionships) // fetch item (sends 404 if nonexistant)
  .get(function(req, res, next) {
    // fetching a specific companionship
    // will be stored in req.companionships by Helper.fetchCompanionships
    if (req.companionships.length === 1) {
      res.status(200).json(req.companionships[0]);
    }
    else {
      console.log("Something went wrong in fetchCompanionships");
      next({status: 500}); // sending an http 500 code to the error handling middleware
    }
  })
  .put(function(req, res, next) {
    if (req.companionships.length === 1) {
      Object.assign(req.companionships[0], req.body); // adding the properties specific in the request body to the companionship
      req.companionships[0].save(function(err, result) {
        if (err) {
          err.status = 500;
          err.message = "Error saving companionship";
          next(err);
        }
        else {
          res.json(result);
        }
      });
    }
    else {
      console.log("Something went wrong in fetchCompanionships");
      next({status: 500});
    }
  });

module.exports = router;
