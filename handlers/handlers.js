module.exports = function(socket, userHandler, userManager) {
  function handleSignOn(user) {
    userHandler.handleSignOn(user, socket, userManager);
  }

  function handleSignOut(user) {
    userManager.addOfflineUser(user);
    let onlineUsers = userManager.onlineUsers;
    let offlineUsers = userManager.offlineUsers;
    socket.emit("Updated online/offline users", {
      userManager,
      onlineUsers,
      offlineUsers
    });
  }

  return { handleSignOn, handleSignOut };
};
