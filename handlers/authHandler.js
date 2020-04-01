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

const handleSignOn = () => {};
