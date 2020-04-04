const redis = require("redis");

const client = redis.createClient(
  "redis://h:pbd0ea46cc29cb044195493a883b6e4f63c50e998424bbe086ca61c080cf6a0f4@ec2-52-86-253-161.compute-1.amazonaws.com:25209"
);

module.exports = client;
