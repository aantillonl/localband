import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import searchBoxSlice from './searchBoxSlice';
import suggestionsListSlice from './SuggestionsListSlice';
import bandsListSlice from './BandsListSlice';
import createSpotifyPlaylistSlice from './CreateSpotifyPlaylistSlice';

const rootReducer = combineReducers({
  searchBox: searchBoxSlice.reducer,
  suggestionsList: suggestionsListSlice.reducer,
  bandsList: bandsListSlice.reducer,
  createSpotifyPlaylist: createSpotifyPlaylistSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
