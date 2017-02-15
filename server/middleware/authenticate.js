var { User } = require('./../models/user');

var authenticate = (request, response, next) => {
  var token = request.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      //response.status(401).send();
      // instead of duplicating the code in catch, just return a reject Promise
      return Promise.reject();
    }

    request.user = user;
    request.token = token;
    next();
  }).catch((error) => {
    response.status(401).send();
  });
};

module.exports = {
  authenticate
};