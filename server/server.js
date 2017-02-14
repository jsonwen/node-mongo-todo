const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
  var todo = new Todo({
    text: request.body.text
  });

  todo.save().then((doc) => {
    response.send(doc);
  }, (error) => {
    response.status(400).send(error);
    //console.log('Unable to save todo', error);
  });

  //console.log(request.body);
});

app.get('/todos', (request, response) => {
  Todo.find().then((todos) => {
    response.send({
      todos
    });
  }, (error) => {
    response.status(400).send(error);
  });
});

app.get('/todos/:id', (request, response) => {
  var id = request.params.id;

  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({ todo });
  }).catch((error) => {
    response.status(400).send(error);
  });
});


app.delete('/todos/:id', (request, response) => {
  const id = request.params.id;

  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({ todo });
  }).catch((error) => {
    response.status(400).send(error);
  });
});

app.listen(port, () => {
  console.log('Started on port ', port);
});

module.exports = { app };