const userHandler = require("./userHandler");
const buddyHandler = require("./buddyHandler");

module.exports = function (socket) {
  const handleSignOn = (user) => {
    userHandler.handleSignOn(user, socket);
  };

  const handleSignOut = (user) => {
    userHandler.handleSignOut(user);
  };

  const handleGetBuddies = (user) => {
    buddyHandler.handleGetBuddies(user, socket);
  };

  const handleAddBuddy = (user, buddyName) => {
    buddyHandler.handleAddBuddy(user, buddyName, socket);
  };

  return { handleSignOn, handleSignOut, handleGetBuddies, handleAddBuddy };
};
