module.exports = function(app, database) {
  // main GET request to query the plants with different attributes
  app.get('/plants/search', function(req, res) {
    // what plants to do we need the results to be companions with
    var companions = req.query.companion || [];
    // make sure we have an array, not just a single element
    if (companions.constructor != Array) {
      companions = [companions];
    }
    var companionResult = {};

    // first we need to figure out what plants the user is talking about

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
      companionResult = processCompanionsSnapshots(snapshots);
      res.send(companionResult);
      console.log("Sent results");
    });
  });

  app.get('/plants', function(req, res) {
    database.ref('/').child("plants").once("value", function(snapshot) {
      res.send(snapshot.val());
    });
  });

  // GET request to retrieve information about a specific plant
  app.get('/plants/:plant', function(req, res) {
    // make a query to firebase
    var promise = getPromiseForPlantSearch(database, req.params.plant);
    promise.then(function(snapshot) {
      res.send(snapshot.val());
    });
  });
};

function processCompanionsSnapshots(snapshots) {
  // create an intersection of the companion snapshots
  // plants with any negative interactions will have a value of 0
  // all other plants will give a percentage score which is how many they complement in the set
  console.log("Processing...");
  var result = {};
  snapshots.forEach(function(snapshot) {
    var data = snapshot.val();
    for (var id in data) {
      if (data[id] === "bad") {
        result[id] = 0;
      }
      else if(data[id] === "good" && result.hasOwnProperty(id)) {
        if (result[id] != 0) {
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
