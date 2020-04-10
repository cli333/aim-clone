const userHandler = require("./userHandler");
const buddyHandler = require("./buddyHandler");
const messageHandler = require("./messageHandler");

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

  const handleMessage = (messageObj) => {
    messageHandler.handleMessage(messageObj, socket, io);
  };

  /*
    when receiver receives message object containing room to join
    receiver sends request to join with name of room to join
  */

  const handleJoin = (room) => {
    socket.join(room);
  };

  return {
    handleSignOn,
    handleSignOut,
    handleGetBuddies,
    handleAddBuddy,
    handleMessage,
    handleJoin,
  };
};
