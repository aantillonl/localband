import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities';

const citiesListSlice = createSlice({
  name: 'suggestionsList',
  initialState: {
    suggestions: [],
  },
  extraReducers: {
    [fetchCities.pending]: state => ({ ...state, suggestions: [] }),
    [fetchCities.rejected]: state => ({ ...state, suggestions: [] }),
    [fetchCities.fulfilled]: (state, action) => ({
      ...state,
      suggestions: action.payload,
    }),
  },
});

export default citiesListSlice;
