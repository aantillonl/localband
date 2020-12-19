const restAPIConstant = require('../src/common/restApiConstants');
const apiList = require('./api/index');

const apis = [
  { method: 'get', apiName: 'dbpediaMock' },
  { method: 'get', apiName: 'dbpediaProxy' },
  { method: 'post', apiName: 'testToken' },
  { method: 'post', apiName: 'spotifyToken' }
];

function routes(server) {
  apis.forEach(api => {
    const urlName = api.dependency || api.apiName;
    const apiUrl = restAPIConstant[api.apiName].url;
    server[api.method](apiUrl, apiList[`${urlName}Api`]);
  });
}

module.exports = routes;
