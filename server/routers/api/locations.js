import {Router} from 'express';
import Location from '/server/models/location';
import Helper from '/server/middleware/data-validation';

const router = Router();

router.route('/')
  .post((req, res, next) => {
    if (!req.user) {
      next({status: 401, message: "Authentication required to create a location"})
    }
    else {
      const location = req.body;
      location.user = req.user._id;
      new Location(location).save((err, loc) => {
        req.user.locations.push(loc);
        return loc;
      })
      .then(loc => {
        req.user.save((err, user) => {
          if (err) {
            next({status: 500, message: "Unable to update user with location"});
          }
          else {
            res.status(201).json(loc);
          }
        })
      })
    }
  })

router.route('/id/:locId')
  .get((req, res, next) => {
    if (!req.user) {
      next({status: 401, message: "Authentication required to access this location"})
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
