var express = require('express');
var Companion = require('../../models/companion');
var Helper = require('../../helpers/data_validation');

var router = express.Router();

// All routes have the base route: /companions

router.route('/scores')
  .all(function(req, res, next) {
    req.ids = (req.query.id || "").split(",");
    next();
  },
  Helper.idValidator,
  Helper.fetchPlantsWithCompanions)
  .get(function(req, res, next) {
    var plants = req.plants;
    var companions = plants.map(function(plant) {
      return plant.companions;
    });
    var ids = req.ids;
    var scores = Helper.getCompanionScores(companions, ids);
    res.json(scores);
  });

router.route('/')
  .get(function(req, res) {
    // get all combinations
    Companion.find({}, function(err, result) {
      res.json(result);
    });
  })
  .post(function(req, res, next) {
    // add a new combination
    new Companion(req.body).save(function(err, combo) {
      if (err) {
        err.status = 500;
        next(err);
      }
      else {
        res.location('/api/companions/' + combo._id);
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
  Helper.fetchCompanions) // fetch item (sends 404 if nonexistant)
  .get(function(req, res, next) {
    // fetching a specific companion
    // will be stored in req.companions by Helper.fetchCompanions
    if (req.companions.length === 1) {
      res.status(200).json(req.companions[0]);
    }
    else {
      console.log("Something went wrong in fetchCompanions");
      next({status: 500}); // sending an http 500 code to the error handling middleware
    }
  })
  .put(function(req, res, next) {
    if (req.companions.length === 1) {
      Object.assign(req.companions[0], req.body); // adding the properties specific in the request body to the companion
      req.companions[0].save(function(err, result) {
        if (err) {
          err.status = 500;
          err.message = "Error saving companion";
          next(err);
        }
        else {
          res.json(result);
        }
      });
    }
    else {
      console.log("Something went wrong in fetchCompanions");
      next({status: 500});
    }
  });

module.exports = router;
