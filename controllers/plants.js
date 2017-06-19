var Plant = require('../models/plant.js');

module.exports = function(app) {
  // search for plant info that matches parameters
  app.get('/plants/search', function(req, res) {
    // validate req
    var plantName = "";
    if (typeof req.query.name !== 'undefined') {
      plantName = req.query.name;
    }

    Plant.searchByPrefix(plantName, function(err, results) {
      res.send(results);
    });
  });

  // main GET request to query companions of combinations of plants
  app.get('/plants/companions', function(req, res) {
    // what plants to do we need the results to be companions with
    var companions = req.query.id || [];

    // make sure we have an array, not just a single element
    if (companions.constructor !== Array) {
      companions = [companions];
    }
    var companionResult = {};

    Plant.getCompanions(companions, function(err, result) {
      if (err === null) {
        res.send(result);
      }
      else {
        res.status(err.status).send(err.message);
      }
    });
  });

  // GET all plants info
  app.get('/plants', function(req, res) {
    Plant.all(function(err, result) {
      res.send(result);
    });
  });

  // GET request to retrieve information about a specific plant
  app.get('/plants/id/:plantId', function(req, res) {
    var id = req.params.plantId;
    Plant.getById(id, function(err, plant) {
      if (err === null) {
        res.send(plant);
      }
      else {
        res.status(err.status).send(err.message);
      }
    });
  });

  // create a new plant
  app.post('/plants', function(req, res) {
    res.status(501).send("TODO");
  });

  // modify a plant
  app.put('/plants/:plantid', function(req, res) {
    res.status(501).send("TODO");
  });
};
