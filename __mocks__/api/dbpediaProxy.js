const https = require('https');

/* eslint-disable-next-line no-unused-vars */
module.exports = function(client_req, client_res) {
  console.log('serve: ' + client_req.url);
  client_req.url = client_req.url.replace('dbpediaProxy', 'sparql');
  var options = {
    hostname: 'dbpedia.org',
    port: 443,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers,
    rejectUnauthorized: false
  };

  var proxy = https.request(options, function(res) {
    client_res.writeHead(res.statusCode, res.headers);
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
};
