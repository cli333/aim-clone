const toArray = (array) =>
  array.map((item) => {
    const [id, screenName] = item.split(";");
    return {
      id,
      screenName,
    };
  });

module.exports = { toArray };
