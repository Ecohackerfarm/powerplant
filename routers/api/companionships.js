var express = require('express');
var Companionship = require('../../models/companionship');
var Crop = require('../../models/crop');
var Helper = require('../../helpers/data_validation');

var router = express.Router();

// All routes have the base route: /companionships

router.route('/')
  .get(function(req, res) {
    // get all combinations
    Companionship.find({}, function(err, result) {
      res.json(result);
    });
  })
  .post(function(req, res, next) {
    req.ids = [req.body.crop1, req.body.crop2];
    next();
  },
  Helper.idValidator,
  Helper.checkCrops,
  function(req, res, next) {
    // This should be the ONLY route to add a new combination
    // first need to check if it exists already
    Companionship.find().byCrop(req.ids[0], req.ids[1]).exec(function(err, matches) {
      if (err) {
        next({status: 500, message: err.message});
      }
      else {
        if (matches.length > 0) {
          res.status(303).location('/api/companionships/' + matches[0]).json();
        }
        else {
          new Companionship(req.body).save(function(err, combo) {
            if (err) {
              next({status:400, message: err.message});
            }
            else {
              Crop.findByIdAndUpdate(combo.crop1, {
                $push: {companionships: combo._id}
              });
              if (!combo.crop1.equals(combo.crop2)) {
                Crop.findByIdAndUpdate(combo.crop2, {
                  $push: {companionships: combo._id}
                });
              }
              res.location('/api/companionships/' + combo._id);
              res.status(201).json(combo);
            }
          });
        }
      }
    });
  });

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

router.route('/:id')
  .all(function(req, res, next) {
    // storing the id in the request for idValidator
    req.ids = [req.params.id];
    next();
  },
  Helper.idValidator, // validate id (sends 400 if malformed id)
  Helper.fetchCompanionships) // fetch item (sends 404 if nonexistent)
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
    // TODO: validate crop1 and crop2
    var c1Exists = req.body.hasOwnProperty("crop1");
    var c2Exists = req.body.hasOwnProperty("crop2");
    req.ids = [];
    if (c1Exists) {
      req.ids.push(req.body.crop1);
    }
    if (c2Exists) {
      req.ids.push(req.body.crop2);
    }
    if (!c1Exists && !c2Exists) {
      delete req.ids;
    }
    next();
  },
  Helper.idValidator,
  Helper.checkCrops,
  function(req, res, next) {
    // keep in mind we probably don't want anyone changing the crops this refers to
    // but maybe we do. could potentially be useful in case someone makes companionship info with the wrong crops
    // by accident. leaving for now.
    if (req.companionships.length === 1) {
      Object.assign(req.companionships[0], req.body); // adding the properties specific in the request body to the companionship
      req.companionships[0].save(function(err, result) {
        if (err) {
          err.status = 400;
          console.log("Error: " + err.message);
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
  })
  .delete(function(req, res, next) {
    if (req.companionships.length === 1) {
      req.companionships[0].remove(function(err) {
        if (err) {
          // could be an authentication error, but that doesn't exist yet
          err.status = 500;
          next(err);
        }
        else {
          res.json();
        }
      });
    }
    else {
      console.log("Something went wrong in fetchCompanionships");
      next({status: 500}); // sending an http 500 code to the error handling middleware
    }
  });

module.exports = router;
