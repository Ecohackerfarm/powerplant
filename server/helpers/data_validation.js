import mongoose from 'mongoose';
import Crop from '../models/crop';
import Companionship from '../models/companionship';

import * as myself from './data_validation';
export default myself;

export function idValidator(req, res, next) {
  const ids = req.ids;
  if (typeof ids === 'undefined') {
    next();
  }
  else {
    const valid = ids.every(mongoose.Types.ObjectId.isValid);

    if (valid) {
      next();
    }
    else {
      const err = new Error();
      err.status = 400;
      err.message = "Malformed object ID";
      next(err);
    }
  }
}


export function getCompanionshipScores(snapshots, ids) {
  // create an intersection of the companionship snapshots
  // crops with any negative interactions will have a value of 0
  // all other crops will give a percentage score which is how many they complement in the set
  const result = {};
  const maxScore = Companionship.schema.paths.compatibility.options.max;
  const maxTotal = maxScore * snapshots.length;
  for (let i=0; i<ids.length; i++) {
    const data = snapshots[i];
    const queryId = ids[i];
    data.forEach((pair) => {
      // look at the one that is NOT the corresponding id in ids
      // at the same index as the current snapshot
      // Because the current data is for the snapshot for a single crop
      const id = pair.crop2.equals(queryId) ? pair.crop1 : pair.crop2;

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

export const fetchCrops = fetchModel(Crop, "crops");
export const fetchCropsWithCompanionships = fetchModel(Crop, "crops", "companionships");
export const fetchCompanionships = fetchModel(Companionship, "companionships", "crop1 crop2");

export const checkCrops = checkModel(Crop);
export const checkCompanionships = checkModel(Companionship);

// assumes pre-validated ids!
export function fetchModel(model, resultName, populate) {
  return (req, res, next) => {
    if (typeof req.ids === 'undefined') {
      next();
      return;
    }
    req[resultName] = [];
    req.ids.forEach((id) => {
      let query = model.findById(id);
      if (typeof populate !== 'undefined') {
        query = query.populate(populate);
      }
      query.exec((err, item) => {
        if (item !== null) {
          req[resultName].push(item);
          if (req[resultName].length === req.ids.length) {
            // finished fetching crops
            next();
            return;
          }
        }
        else {
          const error = new Error();
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
export function checkModel(model) {
  return (req, res, next) => {
    if (typeof req.ids === 'undefined') {
      next();
      return;
    }
    let counter = 0;
    req.ids.forEach((id) => {
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

export function escapeRegEx(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
