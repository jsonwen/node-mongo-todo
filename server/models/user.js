const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  var user = this; // instance methods are called with the individual document
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

// UserSchema.statics are model methods
// UserSchema.methods are instance methods
UserSchema.statics.findByToken = function(token) {
  var User = this; // model methods get called with the model as the this binding
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function(next) {
  var user = this;
  // don't hash a hashed password
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}