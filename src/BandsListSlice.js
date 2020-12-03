import { createSlice } from '@reduxjs/toolkit';
import fetchBandNames from './FetchBandNames';
import fetchCities from './FetchCities';

const bandsListSlice = createSlice({
  name: 'bandsListSlice',
  initialState: [],

  extraReducers: {
    [fetchBandNames.fulfilled]: (_, action) => action.payload,
    [fetchBandNames.rejected]: state => state,
    [fetchBandNames.pending]: () => [],
    [fetchCities.pending]: () => [],
  },
});

export default bandsListSlice;
