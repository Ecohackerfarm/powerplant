

module.exports = function(app, database) {
  // search for plant info that matches parameters
  app.get('/plants/search', function(req, res)) {
    // validate req
    var plantName = "";
    if (typeof req.query.name !== 'undefined') {
      plantName = req.query.name;
    }


  }

  // main GET request to query companions of combinations of plants
  app.get('/plants/companions', function(req, res) {
    // what plants to do we need the results to be companions with
    var companions = req.query.id || [];

    // make sure we have an array, not just a single element
    if (companions.constructor !== Array) {
      companions = [companions];
    }
    var companionResult = {};

    // first we need to figure out what plants the user is talking about
    // make a query to firebase

    var promises = companions.map(function(item) {
      return getPromiseForPlantCompanions(database, item);
    });
    // only start doing stuff once every requeset is fulfilled
    Promise.all(promises).then(function(snapshots) {
      console.log("All promises returned");
      // TODO figure out EXACTLY what we want to return
      // given the good and bad companions for each plant
      // Is it just the ones that are good for all?
      // Or that are just not bad for any of them?
      // For now, going with at least one good and zero bad.
      // Talk to aimee and kim about this though.
      companionResult = getCompanionScores(snapshots);

      if (typeof req.query.name !== 'undefined') {
        var promise = getPromiseForPlantSearch(database, req.query.name);
        promise.then(function(snapshot) {
          for (plant in snapshot.val()) {

          }
          res.send(snapshot.val() || {});
        });
      }

      res.send(companionResult);
      console.log("Sent results");
    });
  });

  // GET all plants info
  app.get('/plants', function(req, res) {
    database.ref('/').child("plants").once("value", function(snapshot) {
      res.send(snapshot.val());
    });
  });

  // GET request to retrieve information about a specific plant
  app.get('/plants/id/:plantId', function(req, res) {
    // database.ref('/').child('plants').child(req.params.plantId).once('value', function(snapshot) {
    database.ref('/').child('plants').orderByKey().equalTo(req.params.plantId).once('value', function(snapshot) {
      if (snapshot.val() === null) {
        res.status(404).send("Invalid plant id");
      }
      else {
        res.send(snapshot.val());
      }
    });
  });

  // GET a list of plants starting with the query
  app.get('/plants/name/:plantName', function(req, res) {
    // make a query to firebase
    var promise = getPromiseForPlantSearch(database, req.params.plantName);
    promise.then(function(snapshot) {
      res.send(snapshot.val() || {});
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

function getCompanionScores(snapshots) {
  // create an intersection of the companion snapshots
  // plants with any negative interactions will have a value of 0
  // all other plants will give a percentage score which is how many they complement in the set
  console.log("Processing...");
  var result = {};
  snapshots.forEach(function(snapshot) {
    var data = snapshot.val();
    for (var id in data) {
      // building the companion scores, storing in result
      if (data[id] === "bad") {
        result[id] = -1;
      }
      else if(data[id] === "good" && result.hasOwnProperty(id)) {
        if (result[id] != -1) {
          result[id] += 1/snapshots.length;
        }
      }
      else {
        result[id] = 1/snapshots.length;
      }
    }
  });
  return result;
}

function getPromiseForPlantSearch(database, plantName) {
  // name in db should be all lower case, allows for case insensitive search
  plantName = plantName.toLowerCase();
  // will give us everything with a name starting with plantName
  return database.ref('/').child('plants').orderByChild('name').startAt(plantName).endAt(plantName + String.fromCharCode(255)).once('value');
}

function getPromiseForPlantCompanions(database, plantId) {
  return database.ref('/').child('companions').child(plantId).once('value');
}
