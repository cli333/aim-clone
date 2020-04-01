const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;
const auth = require("./routes/auth");

app.use(cors());
app.use(express.json());

app.use("/auth", auth);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

io.on("connection", socket => {
  socket.on("chat message", message => {
    io.emit("chat message", `I am responding to your message => ${message}`);
  });
});

io.on("connection", socket => {
  socket.on("sign on");

  socket.on("sign out");
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
