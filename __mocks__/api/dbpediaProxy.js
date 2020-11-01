const axios = require('axios');
const renderQueryTemplate = require('../../src/common/queryTemplate');
const mapDBPediaResponse = require('./mapDBPediaResponse');

/* eslint-disable-next-line no-unused-vars */
module.exports = function(req, res) {
  axios
    .get('https://dbpedia.org/sparql', {
      params: {
        'default-graph-uri': 'http://dbpedia.org',
        query: renderQueryTemplate(req.query.searchString),
        format: 'application/sparql-results+json',
        timeout: 30000,
        debug: 'off'
      }
    })
    .then(mapDBPediaResponse)
    .then(data => res.json(data))
    .catch(console.log);
};
