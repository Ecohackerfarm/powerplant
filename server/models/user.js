import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const saltRounds = 11;

/**
 * Mongoose User model
 * When fetched with a query, unless explicitly selecting other fields, only the username and id will be returned
 * @constructor
 * @alias User
 * @param {Object} user
 * @param {String} user.username
 * @param {String} user.email
 * @param {String} user.password passed in plaintext, but will be salted and hashed on save
 * @param {(ObjectId[]|server.models.Location[])} [locations] ids of all locations stored under the user
 */
const userSchema = new Schema({
  username: {type: String, index: {unique: true}, required: true},
  email: {type: String, select: false, index: {unique: true}, required: true},
  password: {type: String, select: false, required: true},
  locations: [{type: ObjectId, select: false, ref: "Location"}]
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    // if the password wasn't modified, hash doesn't need to be updated
    next();
  }
  else {
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      user.password = hash;
      next();
    });
  }
});

/**
 * Custom query method for finding a single User by their username
 * @example
 * // fetch the user with username "testUser"
 * User.find().byUsername("testUser").exec((err, user) => {
 *   // do something with user
 * })
 * @alias byUsername
 * @memberof server.models.User
 * @static
 * @param  {String} username exact username to find
 * @return {Mongoose.Query}
 */
userSchema.query.byUsername = function(username) {
  return this.findOne({username});
}

/**
 * @alias checkPassword
 * @memberof server.models.User
 * @param  {String}   password hashed password to check
 * @param  {server.models.User~passwordCheckCallback} callback callback function when done checking
 * @return {None}
 */
userSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

/**
 * @callback server.models.User~passwordCheckCallback
 * @param {String} err error message, if there was one
 * @param {Boolean} success did the passwords match or not?
 */

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
