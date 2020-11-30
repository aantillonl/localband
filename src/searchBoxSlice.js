import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities';

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: {
    searchString: '',
    fetchStatus: 'DEFAULT',
    currentRequestId: null,
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
  },
  extraReducers: {
    [fetchCities.pending]: (state, action) => ({
      ...state,
      currentRequestId: action.meta.requestId,
      fetchStatus: 'PENDING',
    }),
    [fetchCities.fulfilled]: state => ({ ...state, fetchStatus: 'FINISHED' }),
    [fetchCities.rejected]: (state, action) => ({
      ...state,
      fetchStatus:
        action.meta.requestId === state.currentRequestId ? 'FINISHED' : state.fetchStatus,
    }),
  },
});

export default searchBoxSlice;
