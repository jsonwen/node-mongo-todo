const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

var token = jwt.sign(data, 'secret123');
console.log(token);
var decoded = jwt.verify(token, 'secret123');
console.log('decoded', decoded);

// var message = 'jasonblabla';
// var hash = SHA256(message).toString();

// console.log(`hash ${hash}`);

// var data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'salted_secret').toString()
// };


// var resultHash = SHA256(JSON.stringify(token.data) + 'salted_secret').toString();

// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed');
// }
