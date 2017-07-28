import {Router} from 'express';
import User from '/server/models/user';
import Helper from '/server/middleware/data-validation';
import validate from '/shared/validation/loginValidation';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';

// TODO: load jwtSecret from /jwt-secret.pem


const router = Router();

router.route('/')
  .post(
    // first, make sure credentials pass validation
  (req, res, next) => {
    const login = req.body;
    const {errors, isValid} = validate(login);
    if (isValid) {
      next();
    }
    else {
      next({status: 401, message: "Invalid login credentials", errors});
    }
  },
  // next make sure the user exists
  (req, res, next) => {
    const login = req.body;
    User.find().byUsername(login.username).select(["password", "email", "username"]).exec((err, user) => {
      if (!user) {
        next({status: 401, message: "Unable to log in", errors: {
          username: "Username not found"
        }});
      }
      else {
        req.user = user;
        next();
      }
    })
  },
  // finally, check if password is correct
  (req, res, next) => {
    req.user.checkPassword(req.body.password, (err, success) => {
      if (err) {
        next({status: 500, message: "Error logging in"});
      }
      else {
        if (success) {
          const token = jwt.sign({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
          }, jwtSecret);
          res.json({token});
        }
        else {
          next({status: 401, message: "Unable to log in", errors: {
            password: "Incorrect password"
          }});
        }
      }
    });
  });

export default router;
