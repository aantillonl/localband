import { createAsyncThunk } from '@reduxjs/toolkit';
import Bottleneck from 'bottleneck';
import axios from 'axios';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
const spotifyApiUrl = envConfig[environment]['spotify_api_url'];

const limiter = new Bottleneck({ minTime: 10, maxConcurrent: 1 });

function getBandSpotifyId(access_token, bandName) {
  return axios
    .get(`${spotifyApiUrl}/search`, {
      params: {
        q: bandName,
        type: 'artist',
        limit: 1,
      },
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .then(res => res.data.artists.items[0].id);
}

function getBandTopTrackUri(access_token, bandSpotifyId) {
  return axios
    .get(`${spotifyApiUrl}/artists/${bandSpotifyId}/top-tracks?country=from_token`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .then(res => res.data.tracks[0].uri);
}

function getBandSong(access_token, bandName) {
  return getBandSpotifyId(access_token, bandName).then(getBandTopTrackUri.bind(null, access_token));
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
    .then(res => res.data.id);
}

function addSongsToPlaylist(access_token, playlistId, songUriList) {
  return axios.post(
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
  );
}

export default createAsyncThunk('createSpotifyPlaylist', async (access_token, thunkApi) => {
  const { bandsList, createSpotifyPlaylist } = thunkApi.getState();
  const playlistName = createSpotifyPlaylist.playlistName;
  const wrappedGetSong = limiter.wrap(getBandSong.bind(null, access_token));
  const songUriList = (await Promise.all(bandsList.map(wrappedGetSong))).filter(Boolean);
  const spotifyUserId = await getSpotifyUserId(access_token);
  const newPlaylistId = await createPlaylist(access_token, spotifyUserId, playlistName);
  return addSongsToPlaylist(access_token, newPlaylistId, songUriList);
});
