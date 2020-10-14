import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import envConfig from './core/env-config.json';
import qs from 'qs'
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
    return response.data.data
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
