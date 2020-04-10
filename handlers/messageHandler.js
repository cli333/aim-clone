const jwt = require("jsonwebtoken");

/*
  step 0
  verify token
*/

const handleMessage = (messageObj, socket, io) => {
  const { token } = messageObj;
  return jwt.verify(token, "secretkey", emitMessage(messageObj, socket, io));
};

/*
  step 1
  sender joins room indicated in the message object "${sender}/${receiver}"
  send message object to receiver
  wait for receiver to join room "${sender}/${receiver}"
  send message object to everyone in room "${sender}/${receiver}"
*/

const emitMessage = (messageObj, socket, io) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
    const { sender, receiver, room, message } = messageObj;
    const newMessageObj = {
      sender,
      receiver,
      room,
      message,
    };
    socket.join(room);
    io.to(receiver).emit("Open chat window", newMessageObj);
    setTimeout(() => {
      io.in(room).emit("Sent message", newMessageObj);
    }, 400);
  } else {
    console.log("bad token");
  }
};

module.exports = { handleMessage };
