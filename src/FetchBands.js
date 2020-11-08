import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['api_url'];

export default createAsyncThunk('fetchBands', async hometownUri => {
  const response = await axios.get(apiUrl, { params: { hometownUri } });
  return response.data.data;
});
