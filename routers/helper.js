var mongoose = require('mongoose');
var Plant = require('../models/plant');
var Companion = require('../models/companion');

module.exports.idValidator = function(req, res, next) {
  var ids = req.ids;
  console.log("Validating " + ids.length + " ids: " + ids);
  console.log(ids.constructor);
  var valid = ids.every(mongoose.Types.ObjectId.isValid);

  if (valid) {
    console.log("Valid");
    next();
  }
  else {
    console.log("Invalid");
    var err = new Error();
    err.status = 400;
    err.message = "Malformed object ID";
    next(err);
  }
}


module.exports.getCompanionScores = function(snapshots, ids) {
  // create an intersection of the companion snapshots
  // plants with any negative interactions will have a value of 0
  // all other plants will give a percentage score which is how many they complement in the set
  var result = {};
  for (var i=0; i<ids.length; i++) {
    var data = snapshots[i];
    var queryId = ids[i];
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

module.exports.fetchPlants = fetchModel(Plant, "plants");
module.exports.fetchCompanions = fetchModel(Companion, "companions");

module.exports.checkPlants = checkModel(Plant);
module.exports.checkCompanions = checkModel(Companion);

// assumes pre-validated ids!
function fetchModel(model, resultName) {
  return function(req, res, next) {
    req[resultName] = [];
    req.ids.forEach(function(id) {
      console.log("Searching for " + resultName + ": " + id);
      model.findById(id, function(err, item) {
        if (item !== null) {
          req[resultName].push(item);
          if (req[resultName].length === req.ids.length) {
            // finished fetching plants
            next();
          }
        }
        else {
          var error = new Error();
          error.status = 404;
          error.message = "No " + resultName + " with this ID found";
          next(error);
          return;
        }
      });
    });
  }
}

// function factory to check if ids exist in a given model
function checkModel(model) {
  return function(req, res, next) {
    var counter = 0;
    req.ids.forEach(function(id) {
      model.count({_id: id}, function (err, count){
        if(count > 0){
            counter += 1;
            if (counter === req.ids.length) {
              next();
            }
        }
        else {
          var error = new Error();
          error.status = 404;
          error.message = "No object with this ID found";
          next(error);
          return;
        }
      });
    });
  }
}
