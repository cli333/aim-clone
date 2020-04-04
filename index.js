const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const colors = require("colors");
const port = process.env.PORT || 5000;

const redisClient = require("./redisClient/client");

app.use(cors());

const handlers = require("./handlers/handlers");
const userHandler = require("./handlers/userHandler");
const UserManager = require("./managers/userManager");

io.on("connection", (socket) => {
  console.log("a user connected".brightGreen.underline.bold);

  redisClient.set("key", "value", redisClient.print);
  redisClient.get("key", (err, reply) => console.log(reply));

  const userManager = UserManager();

  const { handleSignOn, handleSignOut } = handlers(
    socket,
    userHandler,
    userManager
  );

  socket.on("sign on", (user) => handleSignOn(user));

  socket.on("sign out", (user) => handleSignOut(user));

  // socket.on("get buddies", package => handleGetBuddies(package, socket));

  socket.on("disconnect", () =>
    console.log("a user disconnected".brightRed.underline)
  );
});

server.listen(port, () =>
  console.log(`server listening on port ${port}`.rainbow.bold)
);
