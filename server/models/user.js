import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const saltRounds = 11;


const userSchema = new Schema({
  username: {type: String, index: {unique: true}, required: true},
  email: {type: String, select: false, index: {unique: true}, required: true},
  password: {type: String, select: false, required: true},
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

userSchema.query.byUsername = function(username) {
  return this.findOne({username});
}

userSchema.methods.checkPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(isMatch);
      }
    });
  });
}

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
