const pgClient = require("../pgClient/client");
const redisClient = require("../redisClient/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { toArray } = require("../utils/utils");
const { handleUpdateBuddies } = require("./buddyHandler");

const addOnlineUser = (user) => {
  redisClient.sadd("onlineUsers", `${user.id};${user.screenName}`);
};

const removeOnlineUser = (user) => {
  redisClient.srem("onlineUsers", `${user.id};${user.screenName}`);
};

const isUserOnline = (user, socket, io) => {
  return redisClient.sismember(
    "onlineUsers",
    `${user.id};${user.screenName}`,
    compareHash(user, socket, io)
  );
};

const getOnlineUsers = (socket) => {
  return redisClient.smembers("onlineUsers", (err, onlineUsers) => {
    if (err) {
      console.log(err);
    } else {
      socket.broadcast.emit("Updated online users", toArray(onlineUsers));
    }
  });
};

const handleSignOn = (user, socket, io) => {
  const { screenName } = user;
  let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
  let values = [screenName];
  return pgClient.query(
    query,
    values,
    handlePgClientResponse(user, socket, io)
  );
};

const handleFirstSignOn = (user, socket, io) => (err) => {
  if (err) {
    console.log(err);
  } else {
    const { screenName } = user;
    let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
    let values = [screenName];
    return pgClient.query(query, values, getToken(user, socket, io));
  }
};

const handlePgClientResponse = (user, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result.rows.length === 0) {
    return genHash(user, socket, io);
  } else {
    const { password, id } = result.rows[0];
    userObj = { ...user, hash: password, id };
    return isUserOnline(userObj, socket, io);
  }
};

const compareHash = (user, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result === 0) {
    const { password, hash } = user;
    return bcrypt.compare(password, hash, getToken(user, socket, io));
  } else {
    socket.emit("User already logged in");
  }
};

const genHash = (user, socket, io) => {
  const { password } = user;
  return bcrypt.hash(password, 10, insertUserIntoDb(user, socket, io));
};

const insertUserIntoDb = (user, socket, io) => (err, hash) => {
  if (err) {
    console.log(err);
  } else {
    const { screenName } = user;
    let query = "INSERT INTO users(screenname, password) VALUES($1, $2)";
    let values = [screenName, hash];
    return pgClient.query(query, values, handleFirstSignOn(user, socket, io));
  }
};

const getToken = (user, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result === true) {
    const userObj = { screenName: user.screenName };
    return jwt.sign(userObj, "secretkey", emitToken(user, socket, io));
  } else {
    socket.emit("Incorrect password");
  }
};

const emitToken = (user, socket, io) => (err, token) => {
  if (err) {
    console.log(err);
  } else {
    const { screenName, id } = user;
    const userObj = { screenName, id, token };
    socket.emit("Signed on", userObj);
    addOnlineUser(user);
    socket.join(`${id};${screenName}`);
    handleUpdateBuddies(io, socket);
  }
};

const handleSignOut = (user, socket, io) => {
  removeOnlineUser(user);
  socket.leave(`${user.id};${user.screenName}`, () =>
    console.log(`${user.screenName} has left`)
  );
  handleUpdateBuddies(io, socket);
};

module.exports = {
  handleSignOn,
  handleSignOut,
};
