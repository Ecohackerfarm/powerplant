var express = require('express');
var Crop = require('../../models/crop.js');
var Companion = require('../../models/companion.js');
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
          res.json(err);
        }
        res.json(crops);
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
        //TODO: use error handling middleware
        res.json(err);
      }
      res.json(crops);
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
  .put(function(req, res) {
    // since object ids are generated internally, this can never be used to create a new crop
    // thus the user is trying to update a crop
    Crop.findByIdAndUpdate(req.params.cropId, req.body, function(err, crop) {
      if (err) {
        var error = new Error();
        error.status = 404;
        error.message = "No crops exist with this ID";
      }
      else {
        res.json(crop);
      }
    });
  });

// all associated companion objects of the given cropid
router.route('/:cropId/companions')
  .all(function(req, res, next) {
    req.ids = [req.params.cropId];
    next();
  },
  Helper.idValidator,
  Helper.fetchCropsWithCompanions)
  .get(function(req, res, next) {
    var crop = req.crops[0];
    var promises = crop.companions.map(function(companion) {
      return Companion.findById(companion);
    });
    Promise.all(promises).then(function(companions) {
      res.json(companions);
    });
  });

// fetching a Companion object given crop ids
// TODO: make a hashmap from two crop ids to a companion object
// to fetch the right companion quicker than using Array.find()
router.route('/:cropId1/companions/:cropId2')
  .all(function(req, res, next) {
    req.ids = [req.params.cropId1, req.params.cropId2];
    next();
  },
  Helper.idValidator,
  Helper.fetchCropsWithCompanions)
  .get(function(req, res, next) {
    var companions = req.crops[0].companions;
    var isCompanion = function(c) {
      var id1 = c.crop1;
      var id2 = c.crop2;
      return (id1.equals(req.params.cropId1) && id2.equals(req.params.cropId2)) ||
             (id2.equals(req.params.cropId1) && id1.equals(req.params.cropId2));
    };
    var companion = companions.find(isCompanion);
    if (typeof companion === 'undefined') {
      // both crops exist, they are just neutral about each other
      next({status: 204}); // HTTP code indicating no response on purpose
    }
    else {
      console.log("Found match: " + companion);
      res.status(303).location('/api/companions/' + companion._id).send(); // see other
      // req.ids = [companion._id];
      // next();
    }
  }
  // Helper.fetchCompanions,
  // function(req, res, next) {
  //   res.json(req.companions[0]);
  // }
);

module.exports = router;
