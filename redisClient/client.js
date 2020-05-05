const redis = require("redis");

const client = redis.createClient(
  process.env.REDIS_URI
);

module.exports = client;
