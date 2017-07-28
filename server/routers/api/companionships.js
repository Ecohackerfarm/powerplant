import express from 'express';
import Companionship from '../../models/companionship';
import Crop from '../../models/crop';
import Helper from '../../middleware/data-validation';

const router = express.Router();

// All routes have the base route: /companionships

router.route('/')
  .get((req, res) => {
    // get all combinations - this is REALLY slow (over 2s) but it's also a huge request
    // could consider pagination - return 50 results and a link to the next 50
    Companionship.find({}, (err, result) => {
      res.json(result);
    });
  })
  .post((req, res, next) => {
    req.ids = [req.body.crop1, req.body.crop2];
    next();
  },
  Helper.idValidator,
  Helper.checkCrops,
  (req, res, next) => {
    // This should be the ONLY route to add a new combination
    // first need to check if it exists already
    Companionship.find().byCrop(req.ids[0], req.ids[1]).exec((err, matches) => {
      if (err) {
        next({status: 500, message: err.message});
      }
      else {
        if (matches.length > 0) {
          res.status(303).location('/api/companionships/' + matches[0]).json();
        }
        else {
          new Companionship(req.body).save((err, combo) => {
            if (err) {
              next({status:400, message: err.message});
            }
            else {
              Crop.findByIdAndUpdate(combo.crop1, {
                $push: {companionships: combo._id}
              });
              if (!combo.crop1.equals(combo.crop2)) {
                Crop.findByIdAndUpdate(combo.crop2, {
                  $push: {companionships: combo._id}
                });
              }
              res.location('/api/companionships/' + combo._id);
              res.status(201).json(combo);
            }
          });
        }
      }
    });
  });

router.route('/scores')
  .all((req, res, next) => {
    req.ids = (req.query.id || "").split(",");
    next();
  },
  Helper.idValidator,
  Helper.fetchCropsWithCompanionships)
  .get((req, res, next) => {
    const crops = req.crops;
    const companionships = crops.map((crop) => {
      return crop.companionships;
    });
    const ids = req.ids;
    const scores = Helper.getCompanionshipScores(companionships, ids);
    res.json(scores);
  });

router.route('/:id')
  .all((req, res, next) => {
    // storing the id in the request for idValidator
    req.ids = [req.params.id];
    next();
  },
  Helper.idValidator, // validate id (sends 400 if malformed id)
  Helper.fetchCompanionships) // fetch item (sends 404 if nonexistent)
  .get((req, res, next) => {
    // fetching a specific companionship
    // will be stored in req.companionships by Helper.fetchCompanionships
    const [companionship] = req.companionships;
    if (typeof companionship !== 'undefined') {
      res.status(200).json(companionship);
    }
    else {
      console.log("Something went wrong in fetchCompanionships");
      next({status: 500}); // sending an http 500 code to the error handling middleware
    }
  })
  .put((req, res, next) => {
    // TODO: validate crop1 and crop2
    const c1Exists = req.body.hasOwnProperty("crop1");
    const c2Exists = req.body.hasOwnProperty("crop2");
    req.ids = [];
    if (c1Exists) {
      req.ids.push(req.body.crop1);
    }
    if (c2Exists) {
      req.ids.push(req.body.crop2);
    }
    if (!c1Exists && !c2Exists) {
      delete req.ids;
    }
    next();
  },
  Helper.idValidator,
  Helper.checkCrops,
  (req, res, next) => {
    // keep in mind we probably don't want anyone changing the crops this refers to
    // but maybe we do. could potentially be useful in case someone makes companionship info with the wrong crops
    // by accident. leaving for now.
    const [companionship] = req.companionships;
    if (typeof companionship !== 'undefined') {
      Object.assign(companionship, req.body); // adding the properties specific in the request body to the companionship
      companionship.save((err, result) => {
        if (err) {
          err.status = 400;
          console.log("Error: " + err.message);
          next(err);
        }
        else {
          res.json(result);
        }
      });
    }
    else {
      console.log("Something went wrong in fetchCompanionships");
      next({status: 500});
    }
  })
  .delete((req, res, next) => {
    const [companionship] = req.companionships;
    if (typeof companionship !== 'undefined') {
      companionship.remove((err) => {
        if (err) {
          // could be an authentication error, but that doesn't exist yet
          err.status = 500;
          next(err);
        }
        else {
          res.json();
        }
      });
    }
    else {
      console.log("Something went wrong in fetchCompanionships");
      next({status: 500}); // sending an http 500 code to the error handling middleware
    }
  });

export default router;
