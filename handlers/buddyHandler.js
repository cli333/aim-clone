const client = require("../pgclient/client");
const jwt = require("jsonwebtoken");

function handleGetBuddies({ screenName, token }, socket) {
  let query = "SELECT friends AS 'buddies' FROM users WHERE screenname = $1";
  let values = [screenName];
  jwt.verify(token, "secretkey", (err, authData) => {
    if (err) {
      throw err;
    } else {
      client.query(query, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          const buddies = result.rows[0].buddies;
          socket.emit("got buddies", buddies);
        }
      });
    }
  });
}

module.exports = { handleGetBuddies };
