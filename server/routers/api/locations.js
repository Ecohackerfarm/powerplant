import {Router} from 'express';
import Location from '/server/models/location';
import Helper from '/server/helpers/data-validation';

const router = Router();

router.route('/:locId')
  .get((req, res, next) => {
    console.log("Got location request");
    if (!req.user) {
      next({status: 401, message: "Please log in to access this location"})
    }
    else {
      req.ids = [req.params.locId];
      next();
    }
  },
  Helper.idValidator,
  // first, get the location
  Helper.fetchLocations,
  (req, res, next) => {
    const [location] = req.locations;
    if (typeof location !== 'undefined') {
      // then check agains req.user and see if they're owned by the same person
      if (req.user._id.equals(location.user)) {
        // if they are, return the location
        res.json(location);
      }
      else {
        // otherwise return a 403 forbidden
        next({status: 403, message: "You don't have access to this locaiton"})
      }
    }
    else {
      next({status: 500, message: "Error fetching locations"});
    }
  });

export default router;
