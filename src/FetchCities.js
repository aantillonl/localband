import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import renderQueryTemplate from './common/queryTemplate';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['api_url'];

export default createAsyncThunk('fetchCities', async searchString => {
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
    .then(res => {
      return res.data.results.bindings.map(b => ({
        uri: b.city.value,
        displayName: b.name.value,
      }));
    });
});
