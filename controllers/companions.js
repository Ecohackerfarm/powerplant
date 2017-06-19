var Companion = require('../models/companion');

module.exports = function(app) {
  // main GET request to query companions of combinations of plants
  app.get('/companions', function(req, res) {
    // what plants to do we need the results to be companions with
    var companions = req.query.id || [];

    // make sure we have an array, not just a single element
    if (companions.constructor !== Array) {
      companions = [companions];
    }

    var query = [];
    for (var companion in companions) {
      query.push({plant1: companion});
      query.push({plant2: companion});
    }
    Companion.find().or(query).exec(function(err, result) {
      if (err) {
        res.send(err);
      }
      res.send(result);
    });
  });
}


function getCompanionScores(snapshots) {
  // create an intersection of the companion snapshots
  // plants with any negative interactions will have a value of 0
  // all other plants will give a percentage score which is how many they complement in the set
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
