const jwt = require("jsonwebtoken");

const handleMessage = (messageObj, socket, io) => {
  const { sender, receiver, message } = messageObj;
};

module.exports = { handleMessage };
