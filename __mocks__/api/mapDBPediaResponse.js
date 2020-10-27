module.exports = function(res) {
    return res.data.results.bindings.map(b => ({
        uri: b.city.value,
        displayName: b.name.value
    }))
}