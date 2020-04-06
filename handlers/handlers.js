const userHandler = require("./userHandler");
const buddyHandler = require("./buddyHandler");

module.exports = function (socket, io) {
  const handleSignOn = (user) => {
    userHandler.handleSignOn(user, socket, io);
  };

  const handleSignOut = (user) => {
    userHandler.handleSignOut(user, socket, io);
  };

  const handleGetBuddies = (user) => {
    buddyHandler.handleGetBuddies(user, socket, io);
  };

  const handleAddBuddy = (user, buddyName) => {
    buddyHandler.handleAddBuddy(user, buddyName, socket, io);
  };

  return { handleSignOn, handleSignOut, handleGetBuddies, handleAddBuddy };
};
