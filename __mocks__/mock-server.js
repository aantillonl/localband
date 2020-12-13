const jsonServer = require('json-server');
const server = jsonServer.create();
const cors = require('cors');
const config = require('../src/core/env-config.json');

const environment = process.env.REACT_APP_ENVIRONMENT;
const envconfig = config[environment];

const PORT = envconfig['api_port'] || 4200;

server.use(cors());

// To Secure CORS
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// server.get('/products/:id', cors(corsOptions), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for only example.com.'})
// })

/* Response delay */
const responseDelay = process.env.REACT_APP_RESPONSE_DELAY || 1000;
const message = `Application running in port:  ${PORT} (${environment})`;

/* Middlware for POST calls */
server.use(jsonServer.bodyParser);

/* eslint-disable-next-line no-unused-vars */
server.use(function(req, res, next) {
  setTimeout(function() {
    next();
  }, responseDelay);
});

require('./routes.js')(server);

server.listen(PORT, function() {
  /* eslint no-console: "off" */
  console.log(message);
});

/*
  Use Case:
  ---------
  There are only 4 steps to configure mock server

  Step 1.
    - Dont touch or modify this file mock-server because its configured appropriately
    - If you just need to see the delay of response, you can update delayTimer above,
      now it is set for 1000ms i.e 1 second delay
    - 4200 is the port configured for mock server and this shouldnt be changed as platform ui relies to this port
    - You can access http://localhost:4001 to see the message: Mock Server running in port:4001

  Step 2:
    - You must configure routes.js by adding new api object details to already existing array
    - You must declare your api details inside RestapiConstants and export at last

      Ex: const dummyApi = {
            url: '/api/dummy'
          };

        Add dummyApi to existing apis list:
          const apis = [{ method: 'get', apiName: 'home' }]

        Assuming dummyApi is a post call and after adding dummyApi to the apis, it looks as below:

        const apis = [
          { method: 'get', apiName: 'home' },
          { method: 'post', apiName: 'dummyApi' }
        ]

  Step 3:
    - Create a file for dummyapi, make sure you create the file inside folder api/ with the name specified
      Ex: a. Home api will be created with home.js
          b. Dummy api will be created with dummy.js
          c. You will be just exporting the response, the method is configured inside routes itself

  Step 4:
    - Configure api/index.js by adding newly added dummyapi
    - You must require dummyfile file and export the dummyapi
    - For naming convention purpose, it is now exporting with appending Api at last,
      its upto your choice how you want to export and import

  Complex Api configurations:
  --------------------------
    Consider if the url may contain get and post with the same url, configure twice the methods in routes.js
    Ex: const apis = [
          { method: 'get', apiName: 'dummyApi' },
          { method: 'post', apiName: 'dummyApi' }
        ];
    And if there could be query params which may be like: getUsers and getClusters with the same url.
    You must configure the api/index.js to target necessary export function from dummy.js
     Ex: const {
          foo, // is a function exported from dummy.js
          bar
        } = require('./dummy');

    As per the file name conventions, it is now advised to configure with same file names.
    But if incase the url is differently configured in restapiconstants and actual api call looks different,
    then there is a room to handle the same inside routes.js by alias configuration as below:

    const apis= [{
      method: 'get',
      apiName: 'dummyApi',
      dependency: 'dummyList' // it refers to dummyList file inside folder api/ and not dummy.js
    }]

*/
