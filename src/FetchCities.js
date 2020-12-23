import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { dbpediaResponseValidator, validateCallback } from './schemaValidation';
import renderQueryTemplate from './common/queryTemplate';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV;
const apiUrl = envConfig[environment]['api_url'];

function queryDbPedia(apiUrl, searchString) {
  return axios
    .get(apiUrl, {
      params: {
        'default-graph-uri': 'http://dbpedia.org',
        query: renderQueryTemplate(searchString),
        format: 'application/sparql-results+json',
        timeout: 30000,
        debug: 'off',
      },
    })
    .then(validateCallback.bind(null, dbpediaResponseValidator))
    .then(data =>
      data.results.bindings.map(b => ({
        uri: b.city.value,
        displayName: b.name.value,
      }))
    );
}

export default createAsyncThunk(
  'fetchCities',
  async ({ searchString }, thunkAPI) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (thunkAPI.signal.aborted) thunkAPI({ name: 'AbortError', message: 'Aborted' });
    return queryDbPedia(apiUrl, searchString);
  },
  {
    condition: ({ searchString, updateTextOnly }) => {
      return searchString.length > 3 && !updateTextOnly;
    },
  }
);

export { queryDbPedia };
