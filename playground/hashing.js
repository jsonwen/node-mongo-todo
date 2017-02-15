const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$4X01MrKYo1MMBaFNd57JauuBK6cMXpp1J78Sw8q7.SNq/7uCSTcN6';

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
});

// var data = {
//   id: 10
// }

// var token = jwt.sign(data, 'secret123');
// console.log(token);
// var decoded = jwt.verify(token, 'secret123');
// console.log('decoded', decoded);




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
