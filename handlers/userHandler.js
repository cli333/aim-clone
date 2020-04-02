const { Client } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const elephantConnectionString =
  "postgres://sjjcnsze:x5YGKeKksOXyIg0btWB-bT16IKqhvjR2@drona.db.elephantsql.com:5432/sjjcnsze";
const herokuConnectionString =
  "postgres://yezmhlwafbhdvi:aa754df7fbf73d912bd098a6b5357b3c377c1594d18fb3082579f095d73988ee@ec2-52-203-160-194.compute-1.amazonaws.com:5432/dadfi09fa6c8mf";
const client = new Client({
  connectionString: herokuConnectionString,
  ssl: true
});

client.connect();

function getToken(data) {
  jwt.sign(data, "secretkey", (err, token) => {
    if (err) {
      throw err;
    } else {
      console.log(token);
      return token;
    }
  });
}

function hashPassword(password) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    else return hash;
  });
}

function checkPassword(password, hash) {
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
    }
  });
}

function insertDb(screenName, password) {
  let query = "INSERT INTO users(screenname, password) VALUES($1, $2)";
  let values = [screenName, hashPassword(password)];
  client.query(query, values, (err, result) => {
    if (err) {
      throw err;
    } else {
      return getToken({ screenName });
    }
  });
}

function queryDb(screenName, password) {
  let query = "SELECT * FROM users WHERE screenname = $1 LIMIT 1";
  let values = [screenName];
  client.query(query, values, (err, result) => {
    let token;
    if (err) {
      throw err;
    } else if (result.rows.length === 0) {
      return false;
    } else if (checkPassword(password, result.rows[0].password)) {
      //
    } else {
      return { password: "Incorrect password" };
    }
  });
}

function handleSignOn({ screenName, password }, io, socket) {
  // if no user, create user, return token
  // if user, return token
  // if user but no password, return {incorrect password}
  let token = queryDb(screenName, password);

  // if (!token) return insertDb(screenName, password);

  // // send to sender
  // socket.emit("sign on", { token });
  // // send to all connected
  // io.emit("user sign on", { screenName });
}

function handleSignOut({ screenName }, io, socket) {
  io.emit("user sign out", { screenName });
}

module.exports = {
  handleSignOn,
  handleSignOut
};
