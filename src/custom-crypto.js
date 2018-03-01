const crypto = require('crypto');

const algorithm = 'aes-256-cfb';
const password = 'huhu';

const cipher = crypto.createCipher(algorithm, password);
const decipher = crypto.createDecipher(algorithm, password);

function encrypt(text) {
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

var a = 'abc';
var b = 'cde';
var c = 'abccde';

console.log(encrypt(a));
console.log(encrypt(b));
console.log(encrypt(c));

module.exports = {
  cipher,
  decipher,
  encrypt,
  decrypt
};