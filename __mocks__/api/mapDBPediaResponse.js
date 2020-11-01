module.exports = function(res) {
  const data = res.data.results.bindings.map(b => ({
    uri: b.city.value,
    displayName: b.name.value
  }));
  return { data };
};
