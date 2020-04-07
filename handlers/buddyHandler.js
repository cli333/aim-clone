const pgClient = require("../pgclient/client");
const redisClient = require("../redisClient/client");
const jwt = require("jsonwebtoken");

const handleGetBuddies = (user, socket) => {
  const { token } = user;
  return jwt.verify(token, "secretkey", getBuddies(user, socket));
};

const handleUpdateBuddies = (io, socket) => {
  redisClient.smembers("onlineUsers", updateBuddies(io, socket));
};

const handleAddBuddy = (user, buddyName, socket, io) => {
  const { token } = user;
  return jwt.verify(token, "secretkey", addBuddy(user, buddyName, socket, io));
};

const getBuddies = (user, socket, io) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
    const { screenName } = user;
    let query = "SELECT friends AS buddies FROM users WHERE screenname = $1";
    let values = [screenName];
    return pgClient.query(query, values, checkBuddiesStatus(socket, io, user));
  } else {
    console.log("bad token");
  }
};

const checkBuddiesStatus = (socket, io, user) => (err, result) => {
  let buddies = result.rows[0].buddies;
  if (err) {
    console.log(err);
  } else if (!buddies) {
    socket.emit("Got buddies", { onlineBuddies: [], offlineBuddies: [] });
  } else {
    return buildBuddiesList(socket, io, user, buddies);
  }
};

const buildBuddiesList = (socket, io, user, buddies) => {
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
    .then((buddies) => emitBuddies(socket, io, user, buddies))
    .catch((err) => console.log(err));
};

const emitBuddies = (socket, io, user, buddies) => {
  const onlineBuddies = [];
  const offlineBuddies = [];
  buddies.forEach((buddy) =>
    buddy.isOnline ? onlineBuddies.push(buddy) : offlineBuddies.push(buddy)
  );
  if (io) {
    const { id, screenName } = user;
    io.to(`${id};${screenName}`).emit("Got buddies", {
      onlineBuddies,
      offlineBuddies,
    });
  } else {
    socket.emit("Got buddies", { onlineBuddies, offlineBuddies });
  }
};

const updateBuddies = (io, socket) => (err, onlineUsers) => {
  if (err) {
    console.log(err);
  } else if (onlineUsers.length > 0) {
    for (let onlineUser of onlineUsers) {
      const [id, screenName] = onlineUser.split(";");
      const user = { id, screenName };
      getBuddies(user, socket, io)(null, true);
    }
  }
};

const addBuddy = (user, buddyName, socket, io) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
    // query if buddy exists
    // if not emit buddy not found
    // else add buddy to user's friends
    // and add user to the buddy's friends!!
    // and update both users buddies lists
    // socket.broadcast/emit to both users their updated buddies

    const query = "SELECT * FROM users WHERE screenname = $1";
    const values = [buddyName];
    return pgClient.query(
      query,
      values,
      buddyExists(user, buddyName, socket, io)
    );
  } else {
    console.log("bad token");
  }
};

const buddyExists = (user, buddyName, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (
    result.rows.length > 0 &&
    result.rows[0].screenname !== user.screenName
  ) {
    const { id: friendId, screenname } = result.rows[0];
    // insert buddy into friends list of user

    let query =
      "UPDATE users SET friends = CASE WHEN array_length(friends, 1) IS NULL THEN array_append(friends, $1) WHEN NOT friends @> ARRAY[$1]::varchar[] THEN array_append(friends, $1) ELSE friends END WHERE id = $2";
    let values = [`${friendId};${screenname}`, user.id];
    return pgClient.query(
      query,
      values,
      addUserToBuddy(user, buddyName, socket, io)
    );
  } else {
    socket.emit("No such user");
  }
};

const addUserToBuddy = (user, buddyName, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result.rowCount !== 0) {
    // insert user into friends list of buddy
    let query =
      "UPDATE users SET friends = CASE WHEN array_length(friends, 1) IS NULL THEN array_append(friends, $1) WHEN NOT friends @> ARRAY[$1]::varchar[] THEN array_append(friends, $1) ELSE friends END WHERE screenname = $2";
    let values = [`${user.id};${user.screenName}`, buddyName];
    return pgClient.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        getBuddies(user, socket, io)(null, true);
      }
    });
  } else {
    console.log(152, result);
  }
};

module.exports = { handleGetBuddies, handleAddBuddy, handleUpdateBuddies };
