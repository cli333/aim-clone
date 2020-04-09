const jwt = require("jsonwebtoken");

const handleMessage = (messageObj, socket, io) => {
  const { token } = messageObj;
  return jwt.verify(token, "secretkey", emitMessage(messageObj, socket, io));
};

const emitMessage = (messageObj, socket, io) => (err, authData) => {
  if (err) {
    console.log(err);
  } else if (authData) {
    const { sender, receiver, room, message } = messageObj;
    // const {
    //   sender: { id, screenName },
    //   receiver,
    //   message,
    // } = messageObj;
    // const newMessageObj = {
    //   sender: `${id};${screenName}`,
    //   receiver,
    //   message,
    // };
    // socket.emit("Sent message", newMessageObj);
    // io.to(receiver).emit("Open chat window", newMessageObj);
    // io.to(receiver).emit("Sent message", newMessageObj);

    // socket joins the room
    const newMessageObj = {
      sender,
      receiver,
      room,
      message,
    };
    // sender joins the room
    socket.join(room);
    // send the message to receiver
    io.to(receiver).emit("Open chat window", newMessageObj);
    // send the message to everyone in the room including sender
    setTimeout(() => {
      // HANDLE THIS LATER
      io.in(room).emit("Sent message", newMessageObj);
    }, 100);
  } else {
    console.log("bad token");
  }
};

module.exports = { handleMessage };
