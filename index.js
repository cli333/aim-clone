const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;

app.use(cors());

const handlers = require("./handlers/handlers");
const userHandler = require("./handlers/userHandler");
const UserManager = require("./managers/userManager");

const userManager = UserManager();

// const { handleSignOn, handleSignOut } = require("./handlers/userHandler");
// const { handleGetBuddies } = require("./handlers/apiHandler");

io.on("connection", socket => {
  console.log("a user connected");

  const { handleSignOn, handleSignOut } = handlers(
    socket,
    userHandler,
    userManager
  );

  socket.on("sign on", user => handleSignOn(user));

  socket.on("sign out", user => handleSignOut(user));

  // socket.on("get buddies", package => handleGetBuddies(package, socket));

  // socket.on("disconnect", () => console.log("a user disconnected"));
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
