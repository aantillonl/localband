import { createAsyncThunk } from '@reduxjs/toolkit';
import envConfig from './core/env-config.json';
import axios from 'axios'
import searchBoxSlice from './searchBoxSlice'

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['api_url'];

export default createAsyncThunk(
    'fetchCities',
    async (searchString, thunkAPI) => {
        thunkAPI.dispatch(searchBoxSlice.actions.startFetch())
        const response =  await axios.get(
            apiUrl,
            {params: {searchString}}
        )
        return response.data
    }
)
