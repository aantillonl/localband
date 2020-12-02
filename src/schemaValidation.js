import Ajv from 'ajv';
import { AUTH_SCOPE } from './common/restApiConstants';

const dbpediaResponseSchema = {
  $id: 'dbpedia_response_schema',
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        results: {
          type: 'object',
          properties: {
            bindings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  city: {
                    type: 'object',
                    properties: {
                      value: { type: 'string' },
                    },
                  },
                  name: {
                    type: 'object',
                    properties: {
                      value: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const authResponseSchema = {
  $id: 'spotify_auth_schema',
  type: 'object',
  properties: {
    access_token: { type: 'string' },
    expires_in: { type: 'integer' },
    token_type: { type: 'string', pattern: 'Bearer' },
    scope: { type: 'string', pattern: AUTH_SCOPE },
    refresh_token: { type: 'string' },
  },
};

const ajv = new Ajv({ schemas: [dbpediaResponseSchema, authResponseSchema] });
const dbpediaResponseValidator = ajv.getSchema('dbpedia_response_schema');
const authResponseValidator = ajv.getSchema('spotify_auth_schema');
const validateCallback = (validate, data) => {
  if (!validate(data)) {
    throw Ajv.ValidationError();
  }
  return data;
};

export { dbpediaResponseValidator, authResponseValidator, validateCallback };
