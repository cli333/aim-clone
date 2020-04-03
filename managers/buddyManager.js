const { onlineUsers, offlineUsers } = require("./userManager");

// friends should be an array of arrays
// change on the database!!!

module.exports = function(friends) {
  const onlineBuddies = new Map
  const offlineBuddies = new Map

  for (let onlineUser of Array.from(onlineUsers)) {
    let id = onlineUser[0]
    if (friends.includes(id)) {
      onlineBuddies.set(id, )
    }
  }

  for (let offlineUser of Array.from(offlineUsers)) {
    let id = offlineUser[0]
    if ()
  }

  return {onlineBuddies, offlineBuddies};
};
