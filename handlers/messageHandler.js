const jwt = require("jsonwebtoken");

const handleMessage = (messageObj, socket, io) => {
  const {
    sender: { token },
  } = messageObj;
  return jwt.verify(token, "secretkey", emitMessage(messageObj, socket, io));
};

const emitMessage = (messageObj, socket, io) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
    const {
      sender: { id, screenName },
      receiver,
      message,
    } = messageObj;
    const toSenderObj = {
      me: `${id};${screenName}`,
      notMe: receiver,
      message,
    };
    const toReceiverObj = {
      me: receiver,
      notMe: `${id};${screenName}`,
      message,
    };
    socket.emit("Sent message", toSenderObj);
    io.to(receiver).emit("Open chat window", toReceiverObj);
    io.to(receiver).emit("Sent message", toReceiverObj);
  } else {
    console.log("bad token");
  }
};

module.exports = { handleMessage };
