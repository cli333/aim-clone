const userHandler = require("./userHandler");

module.exports = function (socket) {
  function handleSignOn(user) {
    userHandler.handleSignOn(user, socket);
  }

  function handleSignOut(user) {
    userHandler.handleSignOut(user, socket);
  }

  return { handleSignOn, handleSignOut };
};
