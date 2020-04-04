const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function genHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

function compareHash(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function jwtSign(screenName) {
  return new Promise((resolve, reject) => {
    jwt.sign({ screenName }, "secretkey", (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function toArray(array) {
  return array.map((item) => {
    const [id, screenName] = item.split(";");
    return {
      id,
      screenName,
    };
  });
}

module.exports = { genHash, compareHash, jwtSign, toArray };
