import { createSlice } from '@reduxjs/toolkit';
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

export default createSpotifyPlaylistSlice;
