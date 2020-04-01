const express = require("express");
const router = express.Router();
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

router.post("/", (req, res) => {
  const { screenName, password } = req.body;
  client.query(
    "SELECT * FROM users WHERE screenname = $1 LIMIT 1",
    [screenName],
    (err, result) => {
      if (err) {
        throw err;
      } else if (result.rows.length === 0) {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            throw err;
          } else {
            client.query(
              "INSERT INTO users(screenname, password) VALUES($1, $2)",
              [screenName, hash],
              (err, result) => {
                if (err) {
                  throw err;
                } else {
                  jwt.sign({ screenName }, "secretkey", (err, token) => {
                    res.json({ token });
                  });
                }
              }
            );
          }
        });
      } else {
        const hash = result.rows[0].password;
        bcrypt.compare(password, hash, (err, result) => {
          if (err) {
            throw err;
          } else {
            if (result === true) {
              jwt.sign({ screenName }, "secretkey", (err, token) => {
                res.json({ token });
              });
            } else {
              res.json("Incorrect password");
            }
          }
        });
      }
    }
  );
});

module.exports = router;
