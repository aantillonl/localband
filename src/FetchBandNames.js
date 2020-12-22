import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import envConfig from './core/env-config.json';
import bandsQueryTemplate from './common/bandsQueryTemplate';

const environment = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV;
const apiUrl = envConfig[environment]['api_url'];

export default createAsyncThunk('fetchBandNames', async ({ uri }) => {
  return axios
    .get(apiUrl, {
      params: {
        'default-graph-uri': 'http://dbpedia.org',
        query: bandsQueryTemplate(uri),
        format: 'application/sparql-results+json',
        timeout: 30000,
        debug: 'off'
      }
    })
    .then(res => {
      return res.data.results.bindings.map(b => b.bandName.value);
    });
});
