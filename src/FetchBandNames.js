import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import envConfig from './core/env-config.json';
import bandsQueryTemplate from './common/bandsQueryTemplate';
import SuggestionsListSlice from './SuggestionsListSlice';

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['api_url'];

export default createAsyncThunk('fetchBandNames', async (hometownUri, thunkApi) => {
  return axios
    .get(apiUrl, {
      params: {
        'default-graph-uri': 'http://dbpedia.org',
        query: bandsQueryTemplate(hometownUri),
        format: 'application/sparql-results+json',
        timeout: 30000,
        debug: 'off',
      },
    })
    .then(res => {
      thunkApi.dispatch(SuggestionsListSlice.actions.clearSuggestions());
      return res.data.results.bindings.map(b => b.bandName.value);
    });
});
