const restAPIConstant = require('../src/common/restApiConstants');
const apiList = require('./api/index');

const apis = [
  { method: 'get', apiName: 'home' },
  { method: 'get', apiName: 'dbpediaProxy' }
];

function routes(server) {
  apis.forEach(api => {
    const urlName = api.dependency || api.apiName;
    const apiUrl = restAPIConstant[api.apiName].url;
    console.log(apiList[`${urlName}Api`]);
    server[api.method](apiUrl, apiList[`${urlName}Api`]);
  });

  /* eslint-disable-next-line no-unused-vars */
  server.use('/*', function(req, res) {
    res.json({});
  });
}

module.exports = routes;
