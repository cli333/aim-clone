const client = require("./client");
const jwt = require("jsonwebtoken");

const handleGetFriends = ({ screenName, token }, socket) => {
  let query = "SELECT friends FROM users WHERE screenname = $1";
  let values = [screenName];
  jwt.verify(token, "secretkey", (err, authData) => {
    if (err) {
      throw err;
    } else {
      client.query(query, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          const friends = result.rows[0].friends;
          socket.emit("got friends", friends);
        }
      });
    }
  });
};

module.exports = { handleGetFriends };
