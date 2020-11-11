import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities';

const citiesListSlice = createSlice({
  name: 'suggestionsList',
  initialState: {
    suggestions: [],
    selectedOption: -1,
  },
  reducers: {
    changeSelection: (state, action) => {
      if (action.payload === 'UP' && state.selectedOption > 0) {
        return { ...state, selectedOption: state.selectedOption - 1 };
      } else if (action.payload === 'DOWN' && state.selectedOption < state.suggestions.length - 1) {
        return { ...state, selectedOption: state.selectedOption + 1 };
      }
    },
    clearSuggestions: state => ({
      ...state,
      suggestions: [],
      selectedOption: -1,
    }),
  },
  extraReducers: {
    [fetchCities.fulfilled]: (state, action) => ({
      ...state,
      suggestions: action.payload,
    }),
    [fetchCities.rejected]: state => ({ ...state }),
  },
});

export default citiesListSlice;
