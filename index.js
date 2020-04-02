const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;
const { handleSignOn, handleSignOut } = require("./handlers/userHandler");
// delete routes
const auth = require("./routes/auth");

app.use(cors());
app.use(express.json());

app.use("/auth", auth);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("chat message", message => {
    socket.emit(
      "chat message",
      `I am responding to your message => ${message}`
    );
  });
});

io.on("connection", socket => {
  socket.on("sign on", package => handleSignOn(package, io, socket));

  socket.on("sign out", package => handleSignOut(package, io, socket));
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
