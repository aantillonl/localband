const dbpediaMockApi = require('./dbpediaMock');
const dbpediaProxyApi = require('./dbpediaProxy');
const testTokenApi = require('./testToken');
const spotifyTokenApi = require('./spotifyToken');

module.exports = {
  dbpediaMockApi,
  dbpediaProxyApi,
  testTokenApi,
  spotifyTokenApi: spotifyTokenApi.handler
};
