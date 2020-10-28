import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import searchBoxSlice from './searchBoxSlice';
import suggestionsListSlice from './SuggestionsListSlice';

const rootReducer = combineReducers({searchBox: searchBoxSlice.reducer, suggestionsList: suggestionsListSlice.reducer})

const store = configureStore({ reducer: rootReducer });

export default store;
