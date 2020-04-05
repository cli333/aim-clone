function toArray(array) {
  return array.map((item) => {
    const [id, screenName] = item.split(";");
    return {
      id,
      screenName,
    };
  });
}

module.exports = { toArray };
