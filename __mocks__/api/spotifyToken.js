const https = require('https');
const querystring = require('querystring');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
/* eslint-disable-next-line no-unused-vars */
module.exports = function(client_req, client_res) {
  console.log('serve: ' + client_req.url);
  const data = querystring.stringify(client_req.body);
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  console.log(data);
  console.log(auth);
  const options = {
    hostname: 'accounts.spotify.com',
    path: '/api/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length,
      Authorization: `Basic ${auth}`
    },
    rejectUnauthorized: false
  };

  const proxy = https.request(options, function(res) {
    client_res.writeHead(res.statusCode, res.headers);
    res.pipe(client_res, { end: true });
  });

  proxy.write(data);
  proxy.end();
};
