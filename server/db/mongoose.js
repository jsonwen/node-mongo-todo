const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Let mongoose use promises
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};