import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
const spotifyApiUrl = envConfig[environment]['spotify_api_url'];

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

const bandSongGenerator = (access_token, bandsList) => {
  return {
    async *[Symbol.asyncIterator]() {
      for (const band in bandsList) {
        yield await getBandSpotifyId(access_token, band).then(
          getBandTopTrackUri.bind(null, access_token)
        );
      }
    },
  };
};

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
  const songUriList = Array.from(bandSongGenerator(access_token, bandsList));
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

export { refreshToken, bandSongGenerator, getSpotifyUserId, createPlaylist, addSongsToPlaylist };
