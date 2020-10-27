import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import envConfig from './core/env-config.json';
import axios from 'axios'

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['api_url'];

const fetchCities = createAsyncThunk(
  'fetchCities',
  async (payload, thunkAPI) => {
    const searchString = thunkAPI.getState().searchString
    if (searchString.length < 4) return []
    thunkAPI.dispatch(searchBoxSlice.actions.startFetch())
    const response =  await axios.get(
      apiUrl,
      {params: {searchString}}
    )
    return response.data
  }
)

const fetchBands = createAsyncThunk(
  'fetchBands',
  async (dbpId) => {
    return Promise.resolve(['Lucario', 'Riolu'])
  }
)

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: {
    searchString: "",
    fetchStatus: 'DEFAULT',
    searchResults: [],
    preSearchTimeout: null,
    selectedOption: -1,
    bandsList: []
  },
  reducers: {
    setSearchString: (state, action) => ({...state, searchString: action.payload}),
    setPreSearchTimeout: (state, action) => ({...state, preSearchTimeout: action.payload}),
    startFetch: (state) => ({ ...state,  selectedOption: -1, fetchStatus: 'PENDING' }),
    changeSelection: (state, action) => {
      if (action.payload === "UP" && state.selectedOption > 0) {
        return { ...state, selectedOption: state.selectedOption - 1}
      }
      else if (action.payload === "DOWN" && state.selectedOption < state.searchResults.length - 1) {
        return { ...state, selectedOption: state.selectedOption + 1 }
      }
    }
  },
  extraReducers: {
    [fetchCities.fulfilled]: (state, action) => {
      return {...state, fetchStatus: 'FINISHED', searchResults: action.payload }
    },
    [fetchCities.rejected]: (state, action) => {
      return {...state }
    },
    [fetchBands.fulfilled]: (state, action) => ({...state, bandsList: action.payload})
  }
});

export default searchBoxSlice;
export {fetchCities, fetchBands}
