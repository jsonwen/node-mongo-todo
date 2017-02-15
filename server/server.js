require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (request, response) => {
  var todo = new Todo({
    text: request.body.text,
    _userId: request.user._id
  });

  todo.save().then((doc) => {
    response.send(doc);
  }, (error) => {
    response.status(400).send(error);
    //console.log('Unable to save todo', error);
  });

  //console.log(request.body);
});

app.get('/todos', authenticate, (request, response) => {
  Todo.find({ _userId: request.user._id }).then((todos) => {
    response.send({
      todos
    });
  }, (error) => {
    response.status(400).send(error);
  });
});

app.get('/todos/:id', authenticate, (request, response) => {
  var id = request.params.id;

  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findOne({ _id:id, _userId: request.user._id }).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({ todo });
  }).catch((error) => {
    response.status(400).send(error);
  });
});


app.delete('/todos/:id', authenticate, (request, response) => {
  const id = request.params.id;

  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findOneAndRemove({ _id:id, _userId: request.user._id }).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({ todo });
  }).catch((error) => {
    response.status(400).send(error);
  });
});

app.patch('/todos/:id', authenticate, (request, response) => {
  var id = request.params.id;
  var body = _.pick(request.body, ['text', 'completed']); // filter object to supplied keys

  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id:id, _userId: request.user._id }, { $set:body }, { new: true }).then((todo) => {
    // new returns the new record

    if (!todo) {
      return response.status(404).send();
    }

    response.send({ todo });

  }).catch((error) => {
    response.status(400).send();
  });
});

app.post('/users', (request, response) => {
  const body = _.pick(request.body, ['email', 'password']);
  const user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    //response.send(user);
  }).then((token) => {
    response.header('x-auth', token).send(user);
  }).catch((error) => {
    response.status(400).send(error);
  });
});

app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user);
});

app.post('/users/login', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    //response.send(user);
    return user.generateAuthToken().then((token) => {
      response.header('x-auth', token).send(user);
    });
  }).catch((error) => {
    response.status(400).send(error);
  });
});

app.delete('/users/me/token', authenticate, (request, response) => {
  request.user.removeToken(request.token).then(() => {
    response.status(200).send();
  }, () => {
    response.status(400).send();
  });
});

app.listen(port, () => {
  console.log('Started on port ', port);
});

module.exports = { app };