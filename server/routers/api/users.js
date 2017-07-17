import {Router} from 'express';
import User from '/server/models/user';
import Helper from '/server/helpers/data-validation';
import validate from '/shared/validation/userValidation';

const router = Router();

// all routes have the base url /api/users

router.route('/')
  .post(
    // first, make sure data is valid (not checking for conflicts)
    (req, res, next) => {
    const {errors, isValid} = validate(req.body);
    if (isValid) {
      next();
    }
    else {
      next({status: 400, message: "Invalid user data"});
    }
  },
  (req, res, next) => {
    new User(req.body).save((err, user) => {
      if (!err) {
        res.status(201).json({id: user._id});
      }
      else {
        if (err.name === "ValidationError") {
          next({status: 409, ...err}); //ooh baby that object spread
        }
        else {
          next({status: 400, message: err.message});
        }
      }
    });
  });

router.route('/id/:userId')
  .get((req, res, next) => {
    req.ids = [req.params.userId];
    next();
  },
  Helper.idValidator,
  Helper.fetchUsers,
  (req, res, next) => {
    const [user] = req.users;
    if (typeof user !== 'undefined') {
      res.json(user);
    }
    else {
      next({status: 404, message: "User not found"});
    }
  });

export default router;
