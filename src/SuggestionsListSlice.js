import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities';
import fetchBandNames from './FetchBandNames';

const citiesListSlice = createSlice({
  name: 'suggestionsList',
  initialState: [],
  extraReducers: {
    [fetchCities.pending]: () => [],
    [fetchCities.rejected]: () => [],
    [fetchCities.fulfilled]: (_, action) => action.payload,
    [fetchBandNames.fulfilled]: state => ({ ...state, suggestions: [] }),
  },
});

export default citiesListSlice;
