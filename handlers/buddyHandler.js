const pgClient = require("../pgclient/client");
const redisClient = require("../redisClient/client");
const jwt = require("jsonwebtoken");

const handleGetBuddies = (user, socket) => {
  const { token } = user;
  return jwt.verify(token, "secretkey", getBuddies(user, socket));
};

const handleAddBuddy = (user, buddyName, socket) => {
  const { token } = user;
  return jwt.verify(token, "secretkey", addBuddy(user, buddyName, socket));
};

const getBuddies = (user, socket) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
    const { screenName } = user;
    let query = "SELECT friends AS buddies FROM users WHERE screenname = $1";
    let values = [screenName];
    return pgClient.query(query, values, checkBuddiesStatus(socket));
  } else {
    console.log("bad token");
  }
};

const checkBuddiesStatus = (socket) => (err, result) => {
  let buddies = result.rows[0].buddies;
  if (err) {
    console.log(err);
  } else if (!buddies) {
    socket.emit("Got buddies", { onlineBuddies: [], offlineBuddies: [] });
  } else {
    return buildBuddiesList(socket, buddies);
  }
};

const buildBuddiesList = (socket, buddies) => {
  return Promise.all(
    buddies.map((buddy) => {
      return new Promise((resolve, reject) => {
        redisClient.sismember("onlineUsers", buddy, (err, isOnline) => {
          if (err) {
            reject(err);
          } else if (isOnline === 1) {
            resolve({ buddy, isOnline: true });
          } else {
            resolve({ buddy, isOnline: false });
          }
        });
      });
    })
  )
    .then((buddies) => emitBuddies(socket, buddies))
    .catch((err) => console.log(err));
};

const emitBuddies = (socket, buddies) => {
  const onlineBuddies = [];
  const offlineBuddies = [];
  buddies.forEach((buddy) =>
    buddy.isOnline ? onlineBuddies.push(buddy) : offlineBuddies.push(buddy)
  );
  socket.emit("Got buddies", { onlineBuddies, offlineBuddies });
};

const addBuddy = (user, buddyName, socket) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
    // query if buddy exists
    // if not emit buddy not found
    // else add to pg and emit buddies
  } else {
    console.log("bad token");
  }
};

module.exports = { handleGetBuddies };
