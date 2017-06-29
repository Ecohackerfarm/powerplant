var mongoose = require('mongoose');
var Crop = require('../models/crop');
var Companionship = require('../models/companionship');

module.exports.idValidator = function(req, res, next) {
  var ids = req.ids;
  if (typeof ids === 'undefined') {
    next();
  }
  else {
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
}


module.exports.getCompanionshipScores = function(snapshots, ids) {
  // create an intersection of the companionship snapshots
  // crops with any negative interactions will have a value of 0
  // all other crops will give a percentage score which is how many they complement in the set
  var result = {};
  var maxScore = Companionship.schema.paths.compatibility.options.max;
  console.log(maxScore);
  var maxTotal = maxScore * snapshots.length;
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

      // building the companionship scores, storing in result
      // if a companion crop is incompatible with any query crop, its score will be -1
      // otherwise, it will be the average of all of its compatiblity scores with the query crops
      if (pair.compatibility === -1) {
        result[id] = -1;
      }
      else if(pair.compatibility !== -1 && result.hasOwnProperty(id)) {
        if (result[id] != -1) {
          result[id] += pair.compatibility/maxTotal;
        }
      }
      else {
        result[id] = pair.compatibility/maxTotal;
      }
    });
  }
  return result;
}

module.exports.fetchModel = fetchModel;
module.exports.fetchCrops = fetchModel(Crop, "crops");
module.exports.fetchCropsWithCompanionships = fetchModel(Crop, "crops", "companionships");
module.exports.fetchCompanionships = fetchModel(Companionship, "companionships", "crop1 crop2");

module.exports.checkModel = checkModel;
module.exports.checkCrops = checkModel(Crop);
module.exports.checkCompanionships = checkModel(Companionship);

// assumes pre-validated ids!
function fetchModel(model, resultName, populate) {
  return function(req, res, next) {
    if (typeof req.ids === 'undefined') {
      next();
      return;
    }
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
    if (typeof req.ids === 'undefined') {
      next();
      return;
    }
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
          next({status: 404});
          return;
        }
      });
    });
  }
}

function escapeRegEx(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports.escapeRegEx = escapeRegEx;
