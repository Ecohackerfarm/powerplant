/**
 * Authentication express middleware functions
 * @namespace authentication
 * @memberof server.middleware
 */

import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import User from '/server/models/user';

/**
 * Express middleware to check if a request has authentication.
 * If an authorization header exists, it will either save the user in req.user (if authenticated), or send a 401/404
 * depending if it's an invalid token or if the user doesn't exist
 * If it doesn't exist, this function does nothing and calls next()
 * @function
 * @param  {Object}   req  request object
 * @param  {Object}   res  response object
 * @param  {Function} next
 * @return {None}
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const [,token] = authHeader.split(' ');
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        next({status: 401, message: "Invalid authentication"});
      }
      else {
        User.findById(user.id, (err, userMatch) => {
          if (userMatch) {
            req.user = userMatch;
            next();
          }
          else {
            next({status: 404, message: "User does not exist"})
          }
        });
      }
    });
  }
  else {
    next();
  }
}
