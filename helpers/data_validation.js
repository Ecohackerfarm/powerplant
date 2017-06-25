var mongoose = require('mongoose');
var Crop = require('../models/crop');
var Companion = require('../models/companion');

module.exports.idValidator = function(req, res, next) {
  var ids = req.ids;
  var valid = ids.every(mongoose.Types.ObjectId.isValid);

  if (valid) {
    next();
  }
  else {
    var err = new Error();
    err.status = 400;
    err.message = "Malformed object ID";
    next(err);
  }
}


module.exports.getCompanionScores = function(snapshots, ids) {
  // create an intersection of the companion snapshots
  // crops with any negative interactions will have a value of 0
  // all other crops will give a percentage score which is how many they complement in the set
  var result = {};
  for (var i=0; i<ids.length; i++) {
    var data = snapshots[i];
    var queryId = ids[i];
    data.forEach(function(pair) {
      // look at the one that is NOT the corresponding id in ids
      // at the same index as the current snapshot
      // Because the current data is for the snapshot for a single crop
      var id = pair.crop2;
      if (id.equals(queryId)) {
        id = pair.crop1;
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

module.exports.fetchModel = fetchModel;
module.exports.fetchCrops = fetchModel(Crop, "crops");
module.exports.fetchCropsWithCompanions = fetchModel(Crop, "crops", "companions");
module.exports.fetchCompanions = fetchModel(Companion, "companions", "crop1 crop2");

module.exports.checkModel = checkModel;
module.exports.checkCrops = checkModel(Crop);
module.exports.checkCompanions = checkModel(Companion);

// assumes pre-validated ids!
function fetchModel(model, resultName, populate) {
  return function(req, res, next) {
    req[resultName] = [];
    req.ids.forEach(function(id) {
      var query = model.findById(id);
      if (typeof populate !== 'undefined') {
        query = query.populate(populate);
      }
      query.exec(function(err, item) {
        if (item !== null) {
          req[resultName].push(item);
          if (req[resultName].length === req.ids.length) {
            // finished fetching crops
            next();
            return;
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
