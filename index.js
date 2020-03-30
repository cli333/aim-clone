const express = require("express");
const app = express();
const cors = require("cors");
const pg = require("pg");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const conString =
  "postgres://sjjcnsze:x5YGKeKksOXyIg0btWB-bT16IKqhvjR2@drona.db.elephantsql.com:5432/sjjcnsze";
const client = new pg.Client(conString);
client.connect(err => {
  if (err) {
    return console.log("Could not connect to ElephantSQL", err);
  }
  client.query('SELECT NOW() AS "theTime"', (err, result) => {
    if (err) {
      return console.log("Error running query", err);
    }
    console.log(result.rows[0].theTime);
    client.end();
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});

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

http.listen(port, () => console.log(`Server listening on port ${port}`));
