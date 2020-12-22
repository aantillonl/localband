import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import qs from 'querystring';
import Bottleneck from 'bottleneck';
import { ValidationError } from 'ajv';
import envConfig from './core/env-config.json';
import {
  validateCallback,
  spotifySearchResponseValidator,
  spotifyArtistTopTrackValidator,
  spotifyCreatePlaylistValidator,
  authResponseValidator
} from './schemaValidation';
import { AUTH_SCOPE } from './common/restApiConstants';

const environment = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV;
const spotifyApiUrl = envConfig[environment]['spotify_api_url'];
const redirect_uri = envConfig[environment]['redirect_uri'];

const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 333 });
const AUTH_TIMEOUT = 1000 * 60; // 1 MIN

function getArtistSpotifyId(access_token, bandName) {
  return axios
    .get(`${spotifyApiUrl}/search`, {
      params: {
        q: bandName,
        type: 'artist',
        limit: 1
      },
      headers: { Authorization: `Bearer ${access_token}` }
    })
    .then(validateCallback.bind(null, spotifySearchResponseValidator))
    .then(data =>
      data.artists.items.length > 0 ? data.artists.items[0].id : null
    );
}

function getArtistTopTrackUri(access_token, bandSpotifyId) {
  return axios
    .get(
      `${spotifyApiUrl}/artists/${bandSpotifyId}/top-tracks?country=from_token`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    )
    .then(validateCallback.bind(null, spotifyArtistTopTrackValidator))
    .then(data => (data.tracks.length > 0 ? data.tracks[0].uri : null));
}

function getSpotifyUserId(access_token) {
  return axios
    .get(`${spotifyApiUrl}/me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    .then(res => res.data.id);
}

function createPlaylist(access_token, spotifyUserId, playlistName) {
  return axios
    .post(
      `${spotifyApiUrl}/users/${spotifyUserId}/playlists`,
      {
        name: playlistName,
        public: false,
        description: 'Created with Local Bands App'
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then(validateCallback.bind(null, spotifyCreatePlaylistValidator))
    .then(data => {
      return data.id;
    });
}

function addSongsToPlaylist(access_token, playlistId, songUriList) {
  return axios
    .post(
      `${spotifyApiUrl}/playlists/${playlistId}/tracks`,
      {
        uris: songUriList
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then(res => {
      if (res.status !== 201)
        throw new Error('could not add songs to playlist');
      return res;
    });
}

const filterAndValidateCallback = arr => {
  const filtered = arr.filter(Boolean);
  if (filtered.length > 0) return filtered;
  throw new Error('No valid items to create playlist');
};

function openAuthPopUp() {
  const authParams = {
    client_id: '493fa509a9db44d5867e40a7fdcd58a8',
    response_type: 'code',
    redirect_uri,
    scope: AUTH_SCOPE
  };
  window.open(
    `https://accounts.spotify.com/authorize?${new URLSearchParams(authParams)}`
  );
}

function saveAuthDataToLocalStorage(authData) {
  const isValid = authResponseValidator(authData);
  if (!isValid) throw new ValidationError();
  const { access_token, refresh_token, expires_in } = authData;
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('expiration_date', Date.now() + expires_in * 1000);
  if (refresh_token) {
    localStorage.setItem('refresh_token', refresh_token);
  }
}

function listenForAuthResponseMessage() {
  return new Promise(resolve => {
    window.addEventListener('message', ({ data }) => {
      if (data.eventType === 'spotifyAuthResoponse') resolve(data.code);
    });
    setTimeout(
      () => window.removeEventListener('message', resolve),
      AUTH_TIMEOUT
    );
  });
}

function getSpotifyAuthToken() {
  const storage_access_token = localStorage.getItem('access_token');
  const storage_expiration_date = localStorage.getItem('expiration_date');
  const storage_refresh_token = localStorage.getItem('refresh_token');
  if (storage_access_token && parseInt(storage_expiration_date) > Date.now())
    return Promise.resolve(storage_access_token);

  const saveAuthAndReturnToken = ({ data }) => {
    saveAuthDataToLocalStorage(data);
    return data.access_token;
  };

  if (!storage_access_token) {
    openAuthPopUp();
    return listenForAuthResponseMessage()
      .then(getSpotifyAccessTokenFromApi.bind(null, 'authorization_code'))
      .then(saveAuthAndReturnToken);
  }

  if (
    storage_access_token &&
    storage_refresh_token &&
    storage_expiration_date < Date.now()
  ) {
    return getSpotifyAccessTokenFromApi(
      'refresh_token',
      storage_refresh_token
    ).then(saveAuthAndReturnToken);
  }
}

export default createAsyncThunk(
  'createSpotifyPlaylist',
  async (_, thunkApi) => {
    const access_token = await getSpotifyAuthToken();
    const {
      bandsList,
      searchBox: { searchString: playlistName }
    } = thunkApi.getState();
    const wrappedGetArtistSpotifyId = limiter.wrap(
      getArtistSpotifyId.bind(null, access_token)
    );
    const wrappedGetArtistTopTrackUri = limiter.wrap(
      getArtistTopTrackUri.bind(null, access_token)
    );

    const artistUris = await Promise.all(
      bandsList.map(wrappedGetArtistSpotifyId)
    ).then(filterAndValidateCallback);

    const songUriList = await Promise.all(
      artistUris.map(wrappedGetArtistTopTrackUri)
    ).then(filterAndValidateCallback);

    const spotifyUserId = await getSpotifyUserId(access_token);
    const newPlaylistId = await createPlaylist(
      access_token,
      spotifyUserId,
      playlistName
    );
    return await addSongsToPlaylist(
      access_token,
      newPlaylistId,
      songUriList
    ).then(() => newPlaylistId);
  }
);

const getSpotifyAccessTokenFromApi = async (grant_type, codeOrToken) => {
  const apiUrl = envConfig[environment]['auth_api'];
  const body = { grant_type };
  if (grant_type === 'refresh_token') body.refresh_token = codeOrToken;
  if (grant_type === 'authorization_code') {
    body.code = codeOrToken;
    body.redirect_uri = redirect_uri;
  }
  return axios.post(apiUrl, qs.stringify(body), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

export {
  getSpotifyAuthToken,
  openAuthPopUp,
  getSpotifyAccessTokenFromApi,
  getArtistSpotifyId,
  getSpotifyUserId,
  createPlaylist,
  addSongsToPlaylist,
  getArtistTopTrackUri,
  saveAuthDataToLocalStorage
};
