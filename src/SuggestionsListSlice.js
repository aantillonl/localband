import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities';

const citiesListSlice = createSlice({
  name: 'suggestionsList',
  initialState: {
    suggestions: [],
    selectedOption: -1,
  },
  extraReducers: {
    [fetchCities.pending]: state => ({ ...state, suggestions: [] }),
    [fetchCities.fulfilled]: (state, action) => ({
      ...state,
      suggestions: action.payload,
    }),
    [fetchCities.rejected]: state => ({ ...state }),
  },
});

export default citiesListSlice;
