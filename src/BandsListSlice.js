import { createSlice } from '@reduxjs/toolkit';
import fetchBandNames from './FetchBandNames';

const bandsListSlice = createSlice({
  name: 'bandsListSlice',
  initialState: [],

  extraReducers: {
    [fetchBandNames.fulfilled]: (state, action) => action.payload,
    [fetchBandNames.rejected]: state => ({ ...state }),
  },
});

export default bandsListSlice;
