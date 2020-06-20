import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// import axios from 'axios'

const fetchCities = createAsyncThunk(
  'fetchCities',
  async (searchString, thunkAPI) => {
    if (searchString.length < 4) return {...thunkAPI.getState(), cities: []}
    thunkAPI.dispatch(searchBoxSlice.actions.startFetch())
    const response = ( await new Promise((resolve) => setTimeout(() => {resolve({data: ['chihuahua']})}, 5000)))      
    return {fetchStatus: 'FINISHED', cities: response.data}
  }
)

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: { fetchStatus: 'DEFAULT', cities: [] },
  reducers: {
    startFetch: (state) => ({ ...state,  fetchStatus: 'PENDING' }),
  },
  extraReducers: {
    [fetchCities.fulfilled]: (state, action) => {
      console.log(action.payload)
      return {...state, ...action.payload }
    }
  }
});

export default searchBoxSlice;
export {fetchCities}
