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

const spotifySearchResponseSchema = {
  $id: 'spotify_search_response_schema',
  type: 'object',
  additionalProperties: true,
  required: ['artists'],
  properties: {
    artists: {
      type: 'object',
      additionalProperties: true,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          item: {
            type: 'object',
            additionalProperties: true,
            required: ['id'],
            properties: {
              id: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

const spotifyArtistTopTrackResponseSchema = {
  $id: 'artist_top_track_schema',
  type: 'object',
  additionalProperties: true,
  required: ['tracks'],
  properties: {
    tracks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
        required: ['uri'],
        properties: {
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
};

const spotifyCreatePlaylistResponseSchema = {
  $id: 'spotify_create_playlist_response_schema',
  type: 'object',
  additionalProperties: true,
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

const ajv = new Ajv({
  schemas: [
    dbpediaResponseSchema,
    authResponseSchema,
    spotifySearchResponseSchema,
    spotifyArtistTopTrackResponseSchema,
    spotifyCreatePlaylistResponseSchema,
  ],
});
const dbpediaResponseValidator = ajv.getSchema('dbpedia_response_schema');
const authResponseValidator = ajv.getSchema('spotify_auth_schema');
const spotifySearchResponseValidator = ajv.getSchema('spotify_search_response_schema');
const spotifyArtistTopTrackValidator = ajv.getSchema('artist_top_track_schema');
const spotifyCreatePlaylistValidator = ajv.getSchema('spotify_create_playlist_response_schema');
const validateCallback = (validate, { data }) => {
  if (!validate(data)) {
    throw new Ajv.ValidationError();
  }
  return data;
};

export {
  spotifySearchResponseValidator,
  dbpediaResponseValidator,
  authResponseValidator,
  spotifyArtistTopTrackValidator,
  spotifyCreatePlaylistValidator,
  validateCallback,
};
