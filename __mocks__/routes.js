const restAPIConstant = require('../src/common/restApiConstants');
const apiList = require('./api/index');

const apis = [
  { method: 'get', apiName: 'home' }
];

function routes(server) {
  apis.forEach(api => {
    const urlName = api.dependency || api.apiName;
    const apiUrl = restAPIConstant[api.apiName].url;
    server[api.method](apiUrl, apiList[`${urlName}Api`]);
  });

  /* eslint-disable-next-line no-unused-vars */
  server.use('/*', function(req, res) {
    res.json({});
  });
}

module.exports = routes;
