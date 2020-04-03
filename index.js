const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;
const { handleSignOn, handleSignOut } = require("./handlers/userHandler");
const { handleGetFriends } = require("./handlers/apiHandler");
// delete routes
const auth = require("./routes/auth");

app.use(cors());
app.use(express.json());

app.use("/auth", auth);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => console.log("a user disconnected"));
});

io.on("connection", socket => {
  socket.on("sign on", package => handleSignOn(package, socket));

  socket.on("sign out", package => handleSignOut(package, socket));

  socket.on("broadcast user signed on", package =>
    socket.broadcast.emit("user signed on", package)
  );

  socket.on("get friends", package => handleGetFriends(package, socket));
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
