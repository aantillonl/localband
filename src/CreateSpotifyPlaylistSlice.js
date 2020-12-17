import React from 'react';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import createSpotifyPlaylistThunk from './CreateSpotifyPlaylistThunk';

const createSpotifyPlaylistSlice = createSlice({
  name: 'createSpotifyPlaylistSlice',
  initialState: { createPlaylistStatus: 'DEFAULT', playlistId: null },
  reducers: {
    closeModal: () => ({ createPlaylistStatus: 'DEFAULT' })
  },
  extraReducers: {
    [createSpotifyPlaylistThunk.pending]: () => ({
      createPlaylistStatus: 'PENDING'
    }),
    [createSpotifyPlaylistThunk.rejected]: () => ({
      createPlaylistStatus: 'REJECTED'
    }),
    [createSpotifyPlaylistThunk.fulfilled]: (_, action) => ({
      createPlaylistStatus: 'FULFILLED',
      playlistId: action.payload
    })
  }
});

const createPlaylistStatusSelect = state => state.createPlaylistStatus;
const modalMessageSelector = createSelector(
  [createPlaylistStatusSelect, state => state.playlistId],
  (createPlaylistStatus, playlistId) => {
    if (createPlaylistStatus === 'FULFILLED')
      return (
        <span>
          Playlist created successfully.
          <a
            href={`https://open.spotify.com/user/spotify/playlist/${playlistId}`}>
            Open Playlist
          </a>
        </span>
      );
    if (createPlaylistStatus === 'REJECTED')
      return 'We could not create your playlist this time :(';
    if (createPlaylistStatus === 'PENDING')
      return (
        <span>
          Creating Spotify Playlist
          <br />
          <img src="/images/loading.gif" height="50" alt="Creating playlist" />
        </span>
      );
    return '';
  }
);
const showModalSelector = createSelector(
  createPlaylistStatusSelect,
  createPlaylistStatus => {
    if (createPlaylistStatus === 'DEFAULT') return false;
    return true;
  }
);

export default createSpotifyPlaylistSlice;

export { showModalSelector, modalMessageSelector };
