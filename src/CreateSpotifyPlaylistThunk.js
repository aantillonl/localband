import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Bottleneck from 'bottleneck';
import envConfig from './core/env-config.json';
import {
  validateCallback,
  spotifySearchResponseValidator,
  spotifyArtistTopTrackValidator,
  spotifyCreatePlaylistValidator,
} from './schemaValidation';

const environment = process.env.REACT_APP_ENVIRONMENT;
const spotifyApiUrl = envConfig[environment]['spotify_api_url'];
const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 333 });

function getArtistSpotifyId(access_token, bandName) {
  return axios
    .get(`${spotifyApiUrl}/search`, {
      params: {
        q: bandName,
        type: 'artist',
        limit: 1,
      },
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .then(validateCallback.bind(null, spotifySearchResponseValidator))
    .then(data => data.artists.items[0].id);
}

function getArtistTopTrackUri(access_token, bandSpotifyId) {
  return axios
    .get(`${spotifyApiUrl}/artists/${bandSpotifyId}/top-tracks?country=from_token`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .then(validateCallback.bind(null, spotifyArtistTopTrackValidator))
    .then(data => data.tracks[0].uri);
}

function getSpotifyUserId(access_token) {
  return axios
    .get(`${spotifyApiUrl}/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
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
        description: 'Created with Local Bands App',
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
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
        uris: songUriList,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(res => {
      if (res.status !== 201) throw new Error('could not add songs to playlist');
      return res;
    });
}

export default createAsyncThunk('createSpotifyPlaylist', async (access_token, thunkApi) => {
  const {
    bandsList,
    searchBox: { searchString: playlistName },
  } = thunkApi.getState();
  const wrappedGetArtistSpotifyId = limiter.wrap(getArtistSpotifyId.bind(null, access_token));
  const wrappedGetArtistTopTrackUri = limiter.wrap(getArtistTopTrackUri.bind(null, access_token));

  const artistUris = (await Promise.all(bandsList.map(wrappedGetArtistSpotifyId))).filter(Boolean);
  const songUriList = (await Promise.all(artistUris.map(wrappedGetArtistTopTrackUri))).filter(
    Boolean
  );
  const spotifyUserId = await getSpotifyUserId(access_token);
  const newPlaylistId = await createPlaylist(access_token, spotifyUserId, playlistName);
  return addSongsToPlaylist(access_token, newPlaylistId, songUriList);
});

const refreshToken = async refresh_token => {
  const apiUrl = envConfig[environment]['auth_api'];

  return axios.post(apiUrl, {
    grant_type: 'authorization_code',
    code: refresh_token,
    redirect_uri: 'http://localhost:3000/callback/',
  });
};

export {
  refreshToken,
  getArtistSpotifyId,
  getSpotifyUserId,
  createPlaylist,
  addSongsToPlaylist,
  getArtistTopTrackUri,
};
