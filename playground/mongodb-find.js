// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectId('58a1d0ccd030a291dc8a5c61')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('Unable to fetch todos', error);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (error) => {
  //   console.log('Unable to fetch todos', error);
  // });

  db.collection('Users').find({ name: 'Jason' }).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2))
  }, (error) => {
    console.log('Unable to fetch users', error);
  })

  db.close();
});