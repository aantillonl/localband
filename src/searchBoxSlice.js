import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities';

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: {
    searchString: '',
    fetchStatus: 'DEFAULT',
    preSearchTimeout: null,
    hasSuggestions: false,
  },
  reducers: {
    setSearchString: (state, action) => ({
      ...state,
      searchString: action.payload,
    }),
    setPreSearchTimeout: (state, action) => ({
      ...state,
      preSearchTimeout: action.payload,
    }),
    startSearch: state => ({
      ...state,
      fetchStatus: 'PENDING',
    }),
  },
  extraReducers: {
    [fetchCities.fulfilled]: state => ({ ...state, fetchStatus: 'FINISHED' }),
    [fetchCities.rejected]: state => ({ ...state, fetchStatus: 'FINISHED' }),
    'suggestionsList/clearSuggestions': state => ({
      ...state,
      hasSuggestions: false,
    }),
  },
});

export default searchBoxSlice;
