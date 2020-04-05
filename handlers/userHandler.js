const pgClient = require("../pgClient/client");
const redisClient = require("../redisClient/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  isUserAlreadyOnline,
} = require("../managers/userManager");

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
    let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
    let values = [screenName];
    return pgClient.query(query, values, getToken(user, socket));
  }
};

const handlePgClientResponse = (user, socket) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result.rows.length === 0) {
    // user not in db
    // hash password
    // insert into db
    // query db
    // return token
    console.log("no such user");
    // return genHash(user, socket);
  } else {
    // user in db
    // compare password to hash
    // return token
    console.log("a user found");
    // const { password, id } = result.rows[0];
    // userObj = { ...user, hash: password, id };
    // return isUserOnline(userObj, socket);
  }
};

const isUserOnline = (user, socket) => {
  return redisClient.sismember(
    "onlineUsers",
    `${user.id};${user.screenName}`,
    compareHash(user, socket)
  );
};

const compareHash = (user, socket) => (err, result) => {
  if (err) {
    console.log(err);
  } else if (result === 0) {
    const { password, hash } = user;
    console.log(126, user);
    return bcrypt.compare(password, hash, getToken(user, socket));
  } else {
    socket.emit("User already logged in");
  }
};

const genHash = (user, socket) => {
  if (err) {
    console.log(err);
  } else {
    const { password } = user;
    return bcrypt.hash(password, 10, insertUserIntoDb(user, socket));
  }
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
  } else {
    const userObj = { screenName: user.screenName };
    return jwt.sign(userObj, "secretkey", emitToken(user, socket));
  }
};

const emitToken = (user, socket) => (err, token) => {
  if (err) {
    console.log(err);
  } else {
    const userObj = { ...user, token };
    socket.emit("Signed on", userObj);
    // add user to online redis
    // get online users and emit
  }
};

function handleSignOut(user, socket) {
  removeOnlineUser(user);
  getOnlineUsers().then((onlineUsers) => {
    socket.broadcast.emit("Updated online users", onlineUsers);
  });
}

module.exports = {
  handleSignOn,
  handleSignOut,
};
