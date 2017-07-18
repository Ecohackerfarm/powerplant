import {Router} from 'express';
import Location from '/server/models/location';
import Helper from '/server/helpers/data-validation';

const router = Router();

router.route('/:locId')
  .get((req, res, next) => {
    if (!req.user) {
      next({status: 403, message: "Please log in to access this location"})
    }
    else {
      // first, get the location
      // then check agains req.user and see if they're owned by the same person
      // if they are, return the location
      // otherwise return a 403 forbidden

    }
  })
