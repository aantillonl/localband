const https = require('https');
const { SSM } = require('aws-sdk');
let client;

const getSsmParameters = async () => {
  if (!client) client = new SSM();
  return new Promise((resolve, reject) => {
    client.getParameters(
      {
        Names: ['localband-client-id', 'localband-client-secret'],
        WithDecryption: true
      },
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  })
    .then(data =>
      data.Parameters.reduce((ob, p) => ({ [p.Name]: p.Value, ...ob }), {})
    )
    .then(secrets => {
      return {
        clientId: secrets['localband-client-id'],
        clientSecret: secrets['localband-client-secret']
      };
    });
};

const ssmParametersPromise =
  process.env.NODE_ENV === 'production'
    ? getSsmParameters()
    : Promise.resolve({clientId: 'default', clientSecret: 'default'});

exports.handler = async function(event) {
  const { clientId, clientSecret } = await ssmParametersPromise;
  return proxy(
    clientId,
    clientSecret,
    event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('ascii')
      : event.body
  );
};

function proxy(clientId, clientSecret, authData) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`
      },
      rejectUnauthorized: false
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => resolve(data));
    });
    req.on('error', e => {
      reject(Error(e));
    });
    req.write(authData);
    req.end();
  });
}

exports.proxy = proxy;
exports.getSsmParameters = getSsmParameters;
