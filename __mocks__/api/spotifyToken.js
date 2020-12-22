const https = require('https');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

/* eslint-disable-next-line no-unused-vars */
exports.handler = function(client_req, client_res) {
  const options = {
    hostname: 'accounts.spotify.com',
    path: '/api/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`
    },
    rejectUnauthorized: false
  };

  const proxy = https.request(options, function(res) {
    res.pipe(client_res, { end: true });
  });

  client_req.pipe(proxy, { end: true });
};
