var Plant = require('../models/plant.js');

module.exports = function(app) {
  // search for plant info that matches parameters
  app.get('/plants/search', function(req, res) {
    // validate req
    var plantName = "";
    if (typeof req.query.name !== 'undefined') {
      plantName = req.query.name;
    }

    var regex = new RegExp(plantName, "i");
    Plant.find({name: regex}, function(err, plants) {
      if (err) {
        res.send(err);
      }
      res.send(plants);
    });

  });

  // GET all plants info
  app.get('/plants', function(req, res) {
    Plant.find({}, function(err, plants) {
      if (err) {
        res.send(err);
      }
      res.send(plants);
    });
  });

  // GET request to retrieve information about a specific plant
  app.get('/plants/id/:plantId', function(req, res) {
    var id = req.params.plantId;
    Plant.findById(id, function(err, plant) {
      if (err) {
        res.send(err);
      }
      res.send(plant);
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
