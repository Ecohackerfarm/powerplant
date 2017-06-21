var express = require('express');
var Companion = require('../models/companion');
var Helper = require('./helper');

var router = express.Router();

// All routes have the base route: /companions

router.route('/scores')
  .all(function(req, res, next) {
    req.ids = (req.query.id || "").split(",");
    next();
  },
  Helper.idValidator,
  Helper.checkCompanions)
  .get(function(req, res) {
    var ids = req.ids;

    var promises = ids.map(function(id) {
      var query = [{plant1: id}, {plant2: id}];
      return Companion.find().or(query).exec();
    });
    // once we have every relevant combination, process them and get scores
    Promise.all(promises).then(function(data) {
      res.json(Helper.getCompanionScores(data, ids));
    });
  });

router.route('/')
  .get(function(req, res) {
    // get all combinations
    Companion.find({}, function(err, result) {
      res.json(result);
    });
  })
  .post(function(req, res) {
    // adding a new combination goes here
    new Companion(req.body).save(function(err, combo) {
      if (err) {
        res.json(500, err);
      }
      else {
        res.location('/api/companions/' + combo._id);
        res.status(201, combo);
      }
    });
  });

router.route('/:id')
  .all(function(req, res, next) {
    req.ids = [req.params.id];
    console.log("Sending out: " + req.ids);
    next();
  },
  Helper.idValidator,
  Helper.fetchCompanions)
  .get(function(req, res, next) {
    if (req.companions.length === 1) {
      res.json(req.companions[0]);
    }
    else {
      console.log("Something went wrong in fetchCompanions");
      res.status(500).json();
    }
  })
  .put(function(req, res) {
    // TODO: update an existing combination
  });

module.exports = router;
