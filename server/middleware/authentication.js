import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import User from '/server/models/user';

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
