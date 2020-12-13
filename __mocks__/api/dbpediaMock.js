const mapDBPediaResponse = require('./mapDBPediaResponse');

/* eslint-disable-next-line no-unused-vars */
module.exports = function(req, res) {
  res.json(
    mapDBPediaResponse({
      data: {
        results: {
          distinct: false,
          ordered: true,
          bindings: [
            {
              city: {
                type: 'uri',
                value: 'http://dbpedia.org/resource/Chihuahua_City'
              },
              name: {
                type: 'literal',
                'xml:lang': 'en',
                value: 'Chihuahua City'
              }
            }
          ]
        }
      }
    })
  );
};
