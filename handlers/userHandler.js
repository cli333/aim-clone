const pgClient = require("../pgClient/client");
const redisClient = require("../redisClient/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { toArray } = require("../utils/utils");

const addOnlineUser = (user) => {
  redisClient.sadd("onlineUsers", `${user.id};${user.screenName}`);
};

const removeOnlineUser = (user) => {
  redisClient.srem("onlineUsers", `${user.id};${user.screenName}`);
};

const isUserOnline = (user, socket) => {
  return redisClient.sismember(
    "onlineUsers",
    `${user.id};${user.screenName}`,
    compareHash(user, socket)
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

const handleSignOn = (user, socket) => {
  const { screenName } = user;
  let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
  let values = [screenName];
  return pgClient.query(query, values, handlePgClientResponse(user, socket));
};

const handleFirstSignOn = (user, socket) => (err) => {
  if (err) {
    console.log(err);
  } else {
    const { screenName } = user;
    let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
    let values = [screenName];
    return pgClient.query(query, values, getToken(user, socket));
  }
};

const handlePgClientResponse = (user, socket) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result.rows.length === 0) {
    return genHash(user, socket);
  } else {
    const { password, id } = result.rows[0];
    userObj = { ...user, hash: password, id };
    return isUserOnline(userObj, socket);
  }
};

const compareHash = (user, socket) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result === 0) {
    const { password, hash } = user;
    return bcrypt.compare(password, hash, getToken(user, socket));
  } else {
    socket.emit("User already logged in");
  }
};

const genHash = (user, socket) => {
  const { password } = user;
  return bcrypt.hash(password, 10, insertUserIntoDb(user, socket));
};

const insertUserIntoDb = (user, socket) => (err, hash) => {
  if (err) {
    console.log(err);
  } else {
    const { screenName } = user;
    let query = "INSERT INTO users(screenname, password) VALUES($1, $2)";
    let values = [screenName, hash];
    return pgClient.query(query, values, handleFirstSignOn(user, socket));
  }
};

const getToken = (user, socket) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result === true) {
    const userObj = { screenName: user.screenName };
    return jwt.sign(userObj, "secretkey", emitToken(user, socket));
  } else {
    socket.emit("Incorrect password");
  }
};

const emitToken = (user, socket) => (err, token) => {
  if (err) {
    console.log(err);
  } else {
    const { screenName, id } = user;
    const userObj = { screenName, id, token };
    socket.emit("Signed on", userObj);
    addOnlineUser(user);
  }
};

const handleSignOut = (user) => {
  removeOnlineUser(user);
};

module.exports = {
  handleSignOn,
  handleSignOut,
};
