const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const colors = require("colors");
const { redisClient } = require("./redisPg/clients");
const path = require("path");
const port = process.env.PORT || 5000;

app.use(cors());

const handlers = require("./handlers/handlers");

io.on("connection", (socket) => {
  redisClient.expire("onlineUsers", 1);

  console.log("a user connected".brightGreen.underline.bold);

  const {
    handleSignOn,
    handleSignOut,
    handleGetBuddies,
    handleAddBuddy,
    handleMessage,
    handleJoin,
  } = handlers(socket, io);

  socket.on("sign on", handleSignOn);

  socket.on("sign out", handleSignOut);

  socket.on("get buddies", handleGetBuddies);

  socket.on("add buddy", handleAddBuddy);

  socket.on("send message", handleMessage);

  socket.on("join room", handleJoin);

  socket.on("disconnect", () => {
    console.log("a user disconnected".brightRed.underline);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(port, () =>
  console.log(`server listening on port ${port}`.rainbow.bold)
);
