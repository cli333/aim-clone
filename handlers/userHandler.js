const { pgClient } = require("../redisPg/clients");
const { redisClient } = require("../redisPg/clients");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleUpdateBuddies } = require("./buddyHandler");

const addOnlineUser = (user) => {
  redisClient.sadd("onlineUsers", `${user.id};${user.screenName}`);
};

const removeOnlineUser = (user) => {
  redisClient.srem("onlineUsers", `${user.id};${user.screenName}`);
};

/* 
  chain #1
  fork 2-1
  compare password against db
*/

const isUserOnline = (user, socket, io) => {
  return redisClient.sismember(
    "onlineUsers",
    `${user.id};${user.screenName}`,
    compareHash(user, socket, io)
  );
};

/* 
  chain #1
  check pg for user
*/

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

/* 
  chain #1
  fork 1-3
  get token
*/

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

/* 
  chain #1
  fork 1-0
  no user, generate hash
  fork 2-0
  if user, check if user is already online
*/

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

/*
  chain #1
  fork 2-2
  user not online, compare password and go to fork 1-4
  user online, emit user online
*/

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

/* 
  chain #1
  fork 1-1
  insert user into pg
*/

const genHash = (user, socket, io) => {
  const { password } = user;
  return bcrypt.hash(password, 10, insertUserIntoDb(user, socket, io));
};

/* 
  chain #1
  fork 1-2
  query pg for user info
*/

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

/* 
  chain #1
  fork 1-4
  send token to user
*/

const getToken = (user, socket, io) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result) {
    const userObj = { screenName: user.screenName };
    return jwt.sign(userObj, "secretkey", emitToken(user, socket, io));
  } else {
    socket.emit("Incorrect password");
  }
};

/* 
  chain #1
  fork 1-5
  send token etc
  update redis online users
  user joins own room
  send updates to online users
*/

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

/* 
  update redis online users
  send updates to online users
*/

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
