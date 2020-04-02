const { Client } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const elephantConnectionString =
  "postgres://sjjcnsze:x5YGKeKksOXyIg0btWB-bT16IKqhvjR2@drona.db.elephantsql.com:5432/sjjcnsze";
const herokuConnectionString =
  "postgres://yezmhlwafbhdvi:aa754df7fbf73d912bd098a6b5357b3c377c1594d18fb3082579f095d73988ee@ec2-52-203-160-194.compute-1.amazonaws.com:5432/dadfi09fa6c8mf";
const client = new Client({
  connectionString: herokuConnectionString,
  ssl: true
});

client.connect();

const handleSignOn = ({ screenName, password }, socket) => {
  let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
  let values = [screenName];
  client.query(query, values, (err, result) => {
    if (err) {
      throw err;
    } else if (result.rows.length === 0) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          throw err;
        } else {
          let query = "INSERT INTO users(screenname, password) VALUES($1, $2)";
          let values = [screenName, hash];
          client.query(query, values, (err, result) => {
            if (err) {
              throw err;
            } else {
              jwt.sign({ screenName }, "secretkey", (err, token) => {
                socket.emit("signed on", { screenName, token });
                socket.broadcast.emit("user signed on", { screenName });
              });
            }
          });
        }
      });
    } else {
      const hash = result.rows[0].password;
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (result === true) {
            jwt.sign({ screenName }, "secretkey", (err, token) => {
              socket.emit("signed on", { screenName, token });
              socket.broadcast.emit("user signed on", { screenName });
            });
          } else {
            socket.emit("Incorrect password");
          }
        }
      });
    }
  });
};

const handleSignOut = ({ screenName }, socket) => {
  socket.emit("signed out");
  socket.broadcast.emit("user signed out", { screenName });
};

module.exports = {
  handleSignOn,
  handleSignOut
};
