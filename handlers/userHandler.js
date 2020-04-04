const pgClient = require("../pgClient/client");
const {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  isUserAlreadyOnline,
} = require("../managers/userManager");
const { genHash, compareHash, jwtSign } = require("../utils/utils");

function handleSignOn({ screenName, password }, socket) {
  let query1 = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
  let values1 = [screenName];
  pgClient
    .query(query1, values1)
    .then((result1) => {
      if (result1.rows.length === 0) {
        genHash(password)
          .then((hash) => {
            let query2 =
              "INSERT INTO users(screenname, password) VALUES($1, $2)";
            let values2 = [screenName, hash];
            pgClient
              .query(query2, values2)
              .then(() => {
                pgClient
                  .query(query1, values1)
                  .then((result2) => {
                    jwtSign(screenName)
                      .then((token) => {
                        const { id } = result2.rows[0];
                        socket.emit("Signed on", { screenName, token, id });
                        // update online users

                        addOnlineUser({ screenName, id });
                        getOnlineUsers().then((onlineUsers) => {
                          socket.broadcast.emit(
                            "Updated online users",
                            onlineUsers
                          );
                        });
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } else {
        const { password: hash, id } = result1.rows[0];
        isUserAlreadyOnline({ screenName, id }).then((response) => {
          if (response === 0) {
            compareHash(password, hash)
              .then((result) => {
                if (result === true) {
                  jwtSign(screenName)
                    .then((token) => {
                      socket.emit("Signed on", { screenName, token, id });
                      // update online users
                      addOnlineUser({ screenName, id });
                      // socket.emit("Updated online users", getOnlineUsers())
                      getOnlineUsers().then((onlineUsers) => {
                        socket.broadcast.emit(
                          "Updated online users",
                          onlineUsers
                        );
                      });
                    })
                    .catch((err) => console.log(err));
                } else {
                  socket.emit("Incorrect password");
                }
              })
              .catch((err) => console.log(err));
          } else {
            socket.emit("User already logged in");
          }
        });
      }
    })
    .catch((err) => console.log(err));
}

function handleSignOut(user, socket) {
  removeOnlineUser(user);
  getOnlineUsers().then((onlineUsers) => {
    socket.broadcast.emit("Updated online users", onlineUsers);
  });
}

module.exports = {
  handleSignOn,
  handleSignOut,
};
