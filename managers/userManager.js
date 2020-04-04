const redisClient = require("../redisClient/client");
const { toArray } = require("../utils/utils");

function addOnlineUser(user) {
  // onlineUsers.set(user.id, { user });
  redisClient.sadd("onlineUsers", `${user.id};${user.screenName}`);
}

function removeOnlineUser(user) {
  // onlineUsers.delete(user.id);
  redisClient.srem("onlineUsers", `${user.id};${user.screenName}`);
}

function getOnlineUsers() {
  return new Promise((resolve, reject) => {
    redisClient.smembers("onlineUsers", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(toArray(result));
      }
    });
  });
}

function isUserAlreadyOnline(user) {
  return new Promise((resolve, reject) => {
    redisClient.sismember(
      "onlineUsers",
      `${user.id};${user.screenName}`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  isUserAlreadyOnline,
};
