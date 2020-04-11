const { pgClient } = require("../redisPg/clients");
const { redisClient } = require("../redisPg/clients");
const jwt = require("jsonwebtoken");

/* 
  chain #1
  step 0
  verify token
*/

const handleGetBuddies = (user, socket) => {
  const { token } = user;
  return jwt.verify(token, "secretkey", getBuddies(user, socket));
};

/* 
  chain #3
  step 0
  in user handler, when user signs on trickle buddy list updates down to online users
  query redis for online users
*/

const handleUpdateBuddies = (io, socket) => {
  redisClient.smembers("onlineUsers", updateBuddies(io, socket));
};

/* 
  chain #2
  step 0
  verify token
*/

const handleAddBuddy = (user, buddyName, socket, io) => {
  const { token } = user;
  return jwt.verify(token, "secretkey", addBuddy(user, buddyName, socket, io));
};

/* 
  chain #1
  step 1
  query pg for buddies
*/

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

/* 
  chain #1
  step 2
  no buddies, emit no buddies
  build buddy list
*/

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

/*
  chain #1
  step 3
  map buddies list to redis query of online users
*/

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

/* 
  chain #1
  step 4
  build separate lists
  if io, emit list to a room
  else send updates to the user
*/

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

/* 
  chain #3
  step 2
  for each online user, send buddy updates
  go to chain #1 step 1
*/

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

/*
  chain #2
  step 1
  query pg for buddy
*/

const addBuddy = (user, buddyName, socket, io) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
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

/*
  chain #2
  step 2
  if buddy and buddy is not the user, update user's friends list
  else emit no buddy
*/

const buddyExists = (user, buddyName, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (
    result.rows.length > 0 &&
    result.rows[0].screenname !== user.screenName
  ) {
    const { id: friendId, screenname } = result.rows[0];
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

/* 
  chain #2
  step 3
  add user to the buddy's friends list
  then chain #1 step 1
  pass in io, so buddy list updates will be passed to the room that the buddy occupies
*/

const addUserToBuddy = (user, buddyName, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result.rowCount !== 0) {
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
    console.log("failed to add user", result);
  }
};

module.exports = { handleGetBuddies, handleAddBuddy, handleUpdateBuddies };
