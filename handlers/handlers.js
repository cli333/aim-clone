module.exports = function(socket, userHandler, userManager) {
  function handleSignOn(user) {
    userHandler.handleSignOn(user, socket, userManager);
  }

  function handleSignOut(user) {
    userManager.addOfflineUser(user);
    socket.broadcast.emit("updated online/offline users", {
      ...userManager.onlineUsers,
      ...userManager.offlineUsers
    });
  }

  return { handleSignOn, handleSignOut };
};
