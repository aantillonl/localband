import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
const spotifyApiUrl = envConfig[environment]['spotify_api_url'];

export default createAsyncThunk('createSpotifyPlaylist', async thunkApi => {
  const state = thunkApi.getState()['createSpotifyPlaylist'];
  if (state.authData || !state.authData.auth_token) return;
  return axios.get(spotifyApiUrl, {});
});
