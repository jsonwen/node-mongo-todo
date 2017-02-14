const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '58a2ce1e8494e913419b69e7';

if (!ObjectId.isValid(id)) {
  console.log('ID not valid');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todo', todo);
// }).catch((error) => console.log(error));

var userId = '58a21f191ba802eb2e753d46';
if (!ObjectId.isValid(userId)) {
  return console.log('User Id is not valid');
}

User.findById(userId).then((user) => {
  if (!user) {
    return console.log('User not found')
  }
  console.log('User', user)
}).catch((error) => console.log(error));