const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();
const config = require('./../src/core/env-config.json');
const app = express();

app.use(helmet());
app.use(cors());

// To Secure CORS
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.get('/products/:id', cors(corsOptions), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for only example.com.'})
// })

const environment = process.env.REACT_APP_ENVIRONMENT;
const envconfig = config[environment];

const PORT = envconfig['ui_port'];
const API_URL = envconfig['api_url'];

switch (environment) {
  case 'production':
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '../build/index.html'));
    });
    startServer(app);
    break;

  case 'staging':
    app.all('/*', function(req, res) {
      apiProxy.web(req, res, { target: API_URL });
    });
    break;

  default:
    break;
}

function startServer(app) {
  const message = `Application running in port:  ${PORT} (${environment})`;

  app.listen(PORT, () => {
    console.log(message);
  });
}
