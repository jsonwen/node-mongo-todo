const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value)
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },token: {
      type: String,
      required: true
    }
  }]
});

// this method overrides toJSON method from mongoose
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// this is a custom created method
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'secret123');

  user.tokens.push({
    access,
    token
  });

  // chain promises
  // user.save().then(() => {
  //   return token;
  // }).then((token) => {
  //   return token;
  // });
  // OR, see below
  return user.save().then(() => {
    /* eventhough we return a token, the config:
      mongoose.Promise = global.Promise; in mongoose.js
      will return a promise so we can chain the returns.
      The return value is token in this case
    */
    return token;
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}