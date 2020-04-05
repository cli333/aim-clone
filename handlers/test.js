// const { genHash, compareHash, jwtSign } = require("../utils/utils");

// function signOn({ screenName, id }, socket) {
//   jwtSign(screenName)
//     .then((token) => {
//       socket.emit("Signed on", { screenName, token, id });
//       addOnlineUser({ screenName, id });
//       getOnlineUsers().then((onlineUsers) => {
//         socket.broadcast.emit("Updated online users", onlineUsers);
//       });
//     })
//     .catch((err) => console.log(err));
// }

// function handleSignOn({ screenName, password }, socket) {
//   let query1 = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
//   let values1 = [screenName];
//   pgClient
//     .query(query1, values1)
//     .then((result1) => {
//       if (result1.rows.length === 0) {
//         genHash(password)
//           .then((hash) => {
//             let query2 =
//               "INSERT INTO users(screenname, password) VALUES($1, $2)";
//             let values2 = [screenName, hash];
//             pgClient
//               .query(query2, values2)
//               .then(() => {
//                 pgClient
//                   .query(query1, values1)
//                   .then((result2) => {
//                     const { id } = result2.rows[0];
//                     signOn({ screenName, id }, socket);
//                   })
//                   .catch((err) => console.log(err));
//               })
//               .catch((err) => console.log(err));
//           })
//           .catch((err) => console.log(err));
//       } else {
//         const { password: hash, id } = result1.rows[0];
//         isUserAlreadyOnline({ screenName, id }).then((response) => {
//           if (response === 0) {
//             compareHash(password, hash)
//               .then((result) => {
//                 if (result === true) {
//                   signOn({ screenName, id }, socket);
//                 } else {
//                   socket.emit("Incorrect password");
//                 }
//               })
//               .catch((err) => console.log(err));
//           } else {
//             socket.emit("User already logged in");
//           }
//         });
//       }
//     })
//     .catch((err) => console.log(err));
// }

// user = {screenName, password}
