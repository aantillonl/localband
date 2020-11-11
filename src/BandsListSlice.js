import { createSlice } from '@reduxjs/toolkit';
import fetchBandNames from './FetchBandNames';

const bandsListSlice = createSlice({
  name: 'bandsListSlice',
  initialState: {
    bandsList: [],
  },
  extraReducers: {
    [fetchBandNames.fulfilled]: (state, action) => ({
      ...state,
      bandsList: action.payload.map(n => ({ name: n })),
    }),
    [fetchBandNames.rejected]: state => ({ ...state }),
  },
});

export default bandsListSlice;
