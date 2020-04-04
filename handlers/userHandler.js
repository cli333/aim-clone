const client = require("../pgClient/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function handleSignOn({ screenName, password }, socket, userManager) {
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
              let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
              let values = [screenName];
              client.query(query, values, (err, result) => {
                if (err) {
                  throw err;
                } else {
                  const { id } = result.rows[0];
                  jwt.sign({ screenName }, "secretkey", (err, token) => {
                    socket.emit("Signed on", { screenName, token, id });
                    userManager.addOnlineUser(user);
                    socket.broadcast.emit(
                      "Updated online/offline users",
                      "isTHISworking"
                    );
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const { password: hash, id } = result.rows[0];
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (result === true) {
            jwt.sign({ screenName }, "secretkey", (err, token) => {
              socket.emit("Signed on", { screenName, token, id });
              userManager.addOnlineUser(user);
              socket.broadcast.emit(
                "Updated online/offline users",
                "isTHISworking"
              );
            });
          } else {
            socket.emit("Incorrect password");
          }
        }
      });
    }
  });
}

module.exports = {
  handleSignOn,
};
