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

// all associated companionship objects of the given cropid
router.route('/:cropId/companionships')
  .all(function(req, res, next) {
    req.ids = [req.params.cropId];
    next();
  },
  Helper.idValidator,
  Helper.fetchCropsWithCompanionships)
  .get(function(req, res, next) {
    var crop = req.crops[0];
    var promises = crop.companionships.map(function(companionship) {
      return Companionship.findById(companionship);
    });
    Promise.all(promises).then(function(companionships) {
      res.json(companionships);
    });
  });

// fetching a Companionship object given crop ids
// TODO: make a hashmap from two crop ids to a companionship object
// to fetch the right companionship quicker than using Array.find()
// TODO: think about renaming this to make more sense
router.route('/:cropId1/companionships/:cropId2')
  .all(function(req, res, next) {
    req.ids = [req.params.cropId1, req.params.cropId2];
    next();
  },
  Helper.idValidator,
  Helper.fetchCropsWithCompanionships)
  .get(function(req, res, next) {
    var companionships = req.crops[0].companionships;
    var isCompanionship = function(c) {
      var id1 = c.crop1;
      var id2 = c.crop2;
      return (id1.equals(req.params.cropId1) && id2.equals(req.params.cropId2)) ||
             (id2.equals(req.params.cropId1) && id1.equals(req.params.cropId2));
    };
    var companionship = companionships.find(isCompanionship);
    if (typeof companionship === 'undefined') {
      // both crops exist, they are just neutral about each other
      next({status: 204}); // HTTP code indicating no response on purpose
    }
    else {
      console.log("Found match: " + companionship);
      res.status(303).location('/api/companionships/' + companionship._id).send(); // see other
      // req.ids = [companionship._id];
      // next();
    }
  }
  // Helper.fetchCompanionships,
  // function(req, res, next) {
  //   res.json(req.companionships[0]);
  // }
);

module.exports = router;
