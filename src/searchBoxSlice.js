import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import qs from 'qs'
import axios from 'axios'

const fetchCities = createAsyncThunk(
  'fetchCities',
  async (searchString, thunkAPI) => {
    if (searchString.length < 4) return {...thunkAPI.getState(), cities: []}
    thunkAPI.dispatch(searchBoxSlice.actions.startFetch())
    const response =  await axios.get(
      'http://dbpedia.org',
      qs.stringify({
       "default-graph-uri":'http://dbpedia.org',
        query:`SELECT DISTINCT ?city, ?foafname, ?dbpname, ?population WHERE {
          ?city rdf:type <http://dbpedia.org/class/yago/City108524735> .
          OPTIONAL {?city <http://xmlns.com/foaf/0.1/name> ?foafname } .
          OPTIONAL {?city <http://dbpedia.org/property/name> ?dbpname} .
          FILTER (regex(?foafname, "${searchString}", "i")|| regex(?dbpname, "^${searchString}","i")) .
          OPTIONAL {?city <http://dbpedia.org/ontology/populationTotal> ?population}
        } ORDER BY DESC (?population) LIMIT 5`,
        output:'json'
      }),
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
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
