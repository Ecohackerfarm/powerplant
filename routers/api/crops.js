var express = require('express');
var Crop = require('../../models/crop.js');
var Companionship = require('../../models/companionship.js');
var Helper = require('../../helpers/data_validation');

var router = express.Router();

// All routes have the base route /crops

router.route('/')
  .get(function(req, res, next) {
    // validate req
    var cropName = "";
    if (typeof req.query.name !== 'undefined') {
      cropName = req.query.name;
      var regex = new RegExp(cropName, "i");
      Crop.find({name: regex}, function(err, crops) {
        if (err) {
          next({status: 500, message: "Error fetching crops", err: err});
        }
        else {
          res.json(crops);
        }
      });
    }
    else {
      // if no search query, go to next
      next();
    }
  })
  .get(function(req, res) {
    Crop.find({}, function(err, crops) {
      if (err) {
        next({status: 500, message: "Error fetching crops", err: err});
      }
      else {
        res.json(crops);
      }
    });
  })
  .post(function(req, res, next) {
    new Crop(req.body).save(function(err, crop) {
      if (err) {
        next({status: 500, message: err});
      }
      else {
        res.location('/api/crops/' + crop._id);
        res.json(201, crop);
      }
    });
  });

router.route('/:cropId')
  // first validate the id by extracting and using helper function
  .all(function(req, res, next) {
    req.ids = [req.params.cropId];
    next();
  },
  Helper.idValidator,
  Helper.fetchCrops)
  .get(function(req, res, next) {
    // helper function should have stored array of crops in req.crops
    if (req.crops.length === 1) {
      res.json(req.crops[0]);
    }
    else {
      console.log("Something went wrong in fetchCrops");
      res.status(500).json();
    }
  })
  .put(function(req, res, next) {
    // since object ids are generated internally, this can never be used to create a new crop
    // thus the user is trying to update a crop
    Crop.findByIdAndUpdate(req.params.cropId, req.body, function(err, crop) {
      if (err) {
        var error = new Error();
        error.status = 404;
        error.message = "No crops exist with this ID";
        next(error);
      }
      else {
        res.json(crop);
      }
    });
  });

// all associated companionship objects of the given cropid
router.route('/:cropId/companionships')
  .all(function(req, res, next) {
    req.ids = [req.params.cropId];
    next();
  },
  Helper.idValidator,
  Helper.fetchCropsWithCompanionships)
  .get(function(req, res, next) {
    if (req.crops.length === 1) {
      res.json(req.crops[0].companionships);
    }
    else {
      next({status: 500, message: "Something went wrong with fetchCropsWithCompanionships"});
    }
  });

// fetching a Companionship object given crop ids
// TODO: think about renaming this to make more sense
router.route('/:cropId1/companionships/:cropId2')
  .all(function(req, res, next) {
    req.ids = [req.params.cropId1, req.params.cropId2];
    next();
  },
  Helper.idValidator,
  Helper.checkCrops)
  .get(function(req, res, next) {
    // uses the intersection of the crop1 index and the crop2 index, should be efficient
    Companionship.find({$or: [
      {crop1: req.ids[0], crop2: req.ids[1]},
      {crop1: req.ids[1], crop2: req.ids[0]}
    ]}, function(err, matches) {
      if (err) {
        next({status: 500, err: err});
      }
      else if (matches.length === 0) {
        // both crops exist, they are just neutral about each other
        res.status(204).json(); // 204 = intentionally not sending a response
      }
      else {
        res.status(303).location('/api/companionships/' + matches[0]._id).send(); // see other
        // in a browser, this will result in a redirect
      }
    });
  }
);

module.exports = router;
