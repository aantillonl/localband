import { createSlice } from '@reduxjs/toolkit';

const createSpotifyPlaylistSlice = createSlice({
  name: 'createSpotifyPlaylistSlice',
  initialState: { playlistName: '' },
  reducers: {
    setPlaylistName: (state, action) => ({
      ...state,
      playlistName: action.payload,
    }),
  },
});

export default createSpotifyPlaylistSlice;
