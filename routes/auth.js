const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const bcrypt = require("bcrypt");

const elephantConnectionString =
  "postgres://sjjcnsze:x5YGKeKksOXyIg0btWB-bT16IKqhvjR2@drona.db.elephantsql.com:5432/sjjcnsze";
const herokuConnectionString =
  "postgres://qjyymapwpnobtn:4eab2931806cd6a51594358693dd4550da5297a129202cdbdc3abdb9d7c47545@ec2-18-209-187-54.compute-1.amazonaws.com:5432/d80rqsso6qdia2";
const client = new Client({
  connectionString: herokuConnectionString,
  ssl: true
});

client.connect();

router.post("/", (req, res) => {
  const { screenName, password } = req.body;
  const query = "SELECT NOW()";
  client.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
    client.end();
  });
});

module.exports = router;
