import { createSlice } from '@reduxjs/toolkit';

const createSpotifyPlaylistSlice = createSlice({
  name: 'createSpotifyPlaylistSlice',
  initialState: { authData: null },
  reducers: {
    setAuthData: (state, action) => ({ ...state, authData: action.payload }),
  },
});

export default createSpotifyPlaylistSlice;
