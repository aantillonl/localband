import { createSlice } from '@reduxjs/toolkit'
import fetchCities from './FetchCities'

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: {
    searchString: "",
    fetchStatus: 'DEFAULT',
    preSearchTimeout: null,
    hasSuggestions: false
  },
  reducers: {
    setSearchString: (state, action) => ({...state, searchString: action.payload}),
    setPreSearchTimeout: (state, action) => ({...state, preSearchTimeout: action.payload}),
    startFetch: (state) => ({ ...state,  selectedOption: -1, fetchStatus: 'PENDING' })
    
  },
  extraReducers: {
    [fetchCities.fulfilled]: (state, action) => ( {...state, fetchStatus: 'FINISHED', hasSuggestions: action.payload.length > 0}),
    [fetchCities.rejected]: (state, action) => ({...state, fetchStatus: 'FINISHED'}),
    'suggestionsList/clearSuggestions': (state) => ({...state, hasSuggestions: false})
  }
});

export default searchBoxSlice;