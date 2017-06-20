var Companion = require('../models/companion');
var mongoose = require('mongoose');

module.exports = function(app) {
  // main GET request to query companions of combinations of plants
  app.get('/companions', function(req, res) {
    // what plants to do we need the results to be companions with
    var queryIds = req.query.id || "";
    var companions = queryIds.split(",");
    var ids = companions.map(mongoose.Types.ObjectId);

    var promises = ids.map(function(id) {
      var query = [];
      query.push({plant1: id});
      query.push({plant2: id});
      return Companion.find().or(query).exec();
    });
    Promise.all(promises).then(function(data) {
      res.send(getCompanionScores(data, ids));
    });
  });
}

function getCompanionScores(snapshots, ids) {
  // create an intersection of the companion snapshots
  // plants with any negative interactions will have a value of 0
  // all other plants will give a percentage score which is how many they complement in the set
  var result = {};
  for (var i=0; i<ids.length; i++) {
    var data = snapshots[i];
    var queryId = ids[i];
    console.log(queryId);
    // var data = snapshot.val();
    data.forEach(function(pair) {
      // look at the one that is NOT the corresponding id in ids
      // at the same index as the current snapshot
      // Because the current data is for the snapshot for a single crop
      var id = pair.plant2;
      if (id.equals(queryId)) {
        id = pair.plant1;
      }

      // building the companion scores, storing in result
      if (!pair.compatibility) {
        result[id] = -1;
      }
      else if(pair.compatibility && result.hasOwnProperty(id)) {
        if (result[id] != -1) {
          result[id] += 1/snapshots.length;
        }
      }
      else {
        result[id] = 1/snapshots.length;
      }
    });
  }
  return result;
}
