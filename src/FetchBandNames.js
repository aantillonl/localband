import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import envConfig from './core/env-config.json';
import bandsQueryTemplate from './common/bandsQueryTemplate';
import searchBoxSlice from './searchBoxSlice';

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['api_url'];

export default createAsyncThunk('fetchBandNames', async ({ uri, displayName }, { dispatch }) => {
  dispatch(
    searchBoxSlice.actions.setSearchString({
      searchString: displayName,
      updateTextOnly: true,
    })
  );
  return axios
    .get(apiUrl, {
      params: {
        'default-graph-uri': 'http://dbpedia.org',
        query: bandsQueryTemplate(uri),
        format: 'application/sparql-results+json',
        timeout: 30000,
        debug: 'off',
      },
    })
    .then(res => {
      return res.data.results.bindings.map(b => b.bandName.value);
    });
});
