const axios = require('axios');
const renderQueryTemplate = require('../../src/common/queryTemplate');

/* eslint-disable-next-line no-unused-vars */
module.exports = function(req, res) {
   axios.get(
    'https://dbpedia.org/sparql',
    {
      params: {
        'default-graph-uri': 'http://dbpedia.org',
        query: renderQueryTemplate(req.query.searchString),
        format: 'application/sparql-results+json',
        timeout:30000,
        debug: 'off'
       }
    }
  )
  .then(dbres=>dbres.data.results.bindings)
  .then(res.json)
  .catch(console.log);
};
  