const https = require('https');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
/* eslint-disable-next-line no-unused-vars */
module.exports = function(client_req, client_res) {
  console.log('serve: ' + client_req.url);
  const options = {
    hostname: 'accounts.spotify.com',
    path: client_req.url,
    method: client_req.method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString('base64')}`
    },
    rejectUnauthorized: false
  };

  const proxy = https.request(options, function(res) {
    console.log(res.statusCode);
    client_res.writeHead(res.statusCode, res.headers);
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
};
