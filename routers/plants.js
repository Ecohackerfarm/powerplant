var express = require('express');
var Plant = require('../models/plant.js');
var Companion = require('../models/companion.js');
var Helper = require('../helpers/data_validation');

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
        res.json(err);
      }
      res.json(plants);
    });
  })
  .post(function(req, res) {
    new Plant(req.body).save(function(err, plant) {
      if (err) {
        res.json(500, err);
      }
      res.location('/api/plants/' + plant._id);
      res.json(201, plant);
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
  Helper.checkPlants)
  .get(function(req, res, next) {
    var id = req.params.plantId;
    Companion.find().or({plant1: id}, {plant2: id}).exec(function(err, data) {
      res.send(data);
    });
  });

// fetching a Companion object given plant ids
router.route('/:plantId1/companions/:plantId2')
  .all(function(req, res, next) {
    req.ids = [req.params.plantId1, req.params.plantId2];
    next();
  },
  Helper.idValidator,
  Helper.checkPlants)
  .get(function(req, res, next) {
    var query = [];
    query.push({plant1: req.ids[0], plant2: req.ids[1]});
    query.push({plant1: req.ids[1], plant2: req.ids[0]});

    Companion.find().or(query).exec(function(err, data) {
      if (data.length !== 1) {
        res.json(500, data);
        console.log(data);
      }
      else {
        res.json(data[0]);
      }
    })
  });

module.exports = router;
