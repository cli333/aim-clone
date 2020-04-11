const { Client } = require("pg");
const redis = require("redis");

// pg client

const elephantConnectionString =
  "postgres://sjjcnsze:x5YGKeKksOXyIg0btWB-bT16IKqhvjR2@drona.db.elephantsql.com:5432/sjjcnsze";
const herokuConnectionString =
  "postgres://yezmhlwafbhdvi:aa754df7fbf73d912bd098a6b5357b3c377c1594d18fb3082579f095d73988ee@ec2-52-203-160-194.compute-1.amazonaws.com:5432/dadfi09fa6c8mf";

const pgClient = new Client({
  connectionString: herokuConnectionString,
  ssl: true,
});

pgClient.connect();

// redis client

const redisClient = redis.createClient(
  "redis://h:pbd0ea46cc29cb044195493a883b6e4f63c50e998424bbe086ca61c080cf6a0f4@ec2-52-86-253-161.compute-1.amazonaws.com:25209"
);

module.exports = { pgClient, redisClient };
