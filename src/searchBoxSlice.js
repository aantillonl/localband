import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities';
import fetchBandNames from './FetchBandNames';

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: {
    searchString: '',
    fetchStatus: 'DEFAULT',
    currentRequestId: null,
    updateTextOnly: true
  },
  reducers: {
    setSearchString: (state, action) => ({
      ...state,
      searchString: action.payload.searchString,
      updateTextOnly: false
    })
  },
  extraReducers: {
    [fetchCities.pending]: (state, action) => ({
      ...state,
      currentRequestId: action.meta.requestId,
      fetchStatus: 'PENDING'
    }),
    [fetchCities.fulfilled]: state => ({ ...state, fetchStatus: 'FINISHED' }),
    [fetchCities.rejected]: (state, action) => ({
      ...state,
      fetchStatus:
        action.meta.requestId === state.currentRequestId
          ? 'FINISHED'
          : state.fetchStatus
    }),
    [fetchBandNames.pending]: (state, action) => ({
      ...state,
      fetchStatus: 'PENDING',
      searchString: action.meta.arg.displayName,
      updateTextOnly: true
    }),
    [fetchBandNames.fulfilled]: state => ({
      ...state,
      fetchStatus: 'FINISHED'
    }),
    [fetchBandNames.rejected]: state => ({ ...state, fetchStatus: 'FINISHED' })
  }
});

export default searchBoxSlice;
