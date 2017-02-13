// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // ObjectId("58a1d08dcdc80291904a07df")
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectId('58a1d0b234622c91be6e36d7')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectId('58a1d29a82ecf493ffcbceca')
  }, {
    $set: {
      name: 'Jenn 2'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // ObjectId("58a1d29a82ecf493ffcbceca")


  db.close();
});