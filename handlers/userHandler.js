const client = require("./client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  socket.broadcast.emit("user signed out", { screenName });
};

module.exports = {
  handleSignOn,
  handleSignOut
};
