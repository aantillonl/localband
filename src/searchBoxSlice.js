import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import envConfig from './core/env-config.json';
import qs from 'qs'
import axios from 'axios'

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['api_url'];

const fetchCities = createAsyncThunk(
  'fetchCities',
  async (searchString, thunkAPI) => {
    if (searchString.length < 4) return {...thunkAPI.getState(), cities: []}
    thunkAPI.dispatch(searchBoxSlice.actions.startFetch())
    const response =  await axios.get(
      apiUrl,
      qs.stringify({
       "default-graph-uri":'http://dbpedia.org',
        query:`
        PREFIX dbpedia: <http://dbpedia.org/ontology/>
        PREFIX yago: <http://dbpedia.org/class/yago/>

        SELECT DISTINCT ?city, ?name
        WHERE {
            ?city ?t ?type;
                rdfs:label ?name.
            OPTIONAL {?city dbo:populationTotal ?population }.
            FILTER (?type IN (dbo:City, yago:City108524735))
            FILTER (LANG(?name) = "en")
            FILTER regex(?name, "^${searchString}", "i")
        }
        ORDER BY DESC(?population)

         LIMIT 5`,
        output:'json'
      })
    )
    return {fetchStatus: 'FINISHED', cities: response.data}
  }
)

const searchBoxSlice = createSlice({
  name: 'searchBox',
  initialState: { fetchStatus: 'DEFAULT', cities: [], delayedSearch: null },
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
