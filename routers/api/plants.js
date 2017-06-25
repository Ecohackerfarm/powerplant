var express = require('express');
var Plant = require('../../models/plant.js');
var Companion = require('../../models/companion.js');
var Helper = require('../../helpers/data_validation');

var router = express.Router();

// All routes have the base route /plants

router.route('/')
  .get(function(req, res, next) {
    // validate req
    var plantName = "";
    if (typeof req.query.name !== 'undefined') {
      plantName = req.query.name;
      var regex = new RegExp(plantName, "i");
      Plant.find({name: regex}, function(err, plants) {
        if (err) {
          res.json(err);
        }
        res.json(plants);
      });
    }
    else {
      // if no search query, go to next
      next();
    }
  })
  .get(function(req, res) {
    Plant.find({}, function(err, plants) {
      if (err) {
        //TODO: use error handling middleware
        res.json(err);
      }
      res.json(plants);
    });
  })
  .post(function(req, res, next) {
    new Plant(req.body).save(function(err, plant) {
      if (err) {
        next({status: 500, message: err});
      }
      else {
        res.location('/api/plants/' + plant._id);
        res.json(201, plant);
      }
    });
  });

router.route('/:plantId')
  // first validate the id by extracting and using helper function
  .all(function(req, res, next) {
    req.ids = [req.params.plantId];
    next();
  },
  Helper.idValidator,
  Helper.fetchPlants)
  .get(function(req, res, next) {
    // helper function should have stored array of plants in req.plants
    if (req.plants.length === 1) {
      res.json(req.plants[0]);
    }
    else {
      console.log("Something went wrong in fetchPlants");
      res.status(500).json();
    }
  })
  .put(function(req, res) {
    // since object ids are generated internally, this can never be used to create a new plant
    // thus the user is trying to update a plant
    Plant.findByIdAndUpdate(req.params.plantId, req.body, function(err, plant) {
      if (err) {
        var error = new Error();
        error.status = 404;
        error.message = "No plants exist with this ID";
      }
      else {
        res.json(plant);
      }
    });
  });

// all associated companion objects of the given plantid
router.route('/:plantId/companions')
  .all(function(req, res, next) {
    req.ids = [req.params.plantId];
    next();
  },
  Helper.idValidator,
  Helper.fetchPlantsWithCompanions)
  .get(function(req, res, next) {
    var plant = req.plants[0];
    var promises = plant.companions.map(function(companion) {
      return Companion.findById(companion);
    });
    Promise.all(promises).then(function(companions) {
      res.json(companions);
    });
  });

// fetching a Companion object given plant ids
// TODO: make a hashmap from two plant ids to a companion object
// to fetch the right companion quicker than using Array.find()
router.route('/:plantId1/companions/:plantId2')
  .all(function(req, res, next) {
    req.ids = [req.params.plantId1, req.params.plantId2];
    next();
  },
  Helper.idValidator,
  Helper.fetchPlantsWithCompanions)
  .get(function(req, res, next) {
    var companions = req.plants[0].companions;
    var isCompanion = function(c) {
      var id1 = c.plant1;
      var id2 = c.plant2;
      return (id1.equals(req.params.plantId1) && id2.equals(req.params.plantId2)) ||
             (id2.equals(req.params.plantId1) && id1.equals(req.params.plantId2));
    };
    var companion = companions.find(isCompanion);
    if (typeof companion === 'undefined') {
      // both plants exist, they are just neutral about each other
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
