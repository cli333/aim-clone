const client = require("../pgclient/client");

module.exports = function() {
  const onlineUsers = new Map();
  const offlineUsers = new Map();

  function addOnlineUser(user) {
    onlineUsers.set(user.id, { user });
    removeOfflineUser(user);
  }

  function removeOnlineUser(user) {
    onlineUsers.delete(user.id);
  }

  function addOfflineUser(user) {
    offlineUsers.set(user.id, { user });
    removeOnlineUser(user);
  }

  function removeOfflineUser(user) {
    offlineUsers.delete(user.id);
  }

  return {
    onlineUsers,
    offlineUsers,
    addOnlineUser,
    addOfflineUser
  };
};
