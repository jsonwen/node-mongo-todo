const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

Todo.findOneAndRemove({ _id: '58a2daf52cf40a23ac7669ae' }).then((result) => {

});

Todo.findByIdAndRemove('58a2daf52cf40a23ac7669ae').then((todo) => {
  console.log(todo);
});
