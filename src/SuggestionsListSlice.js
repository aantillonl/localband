import { createSlice } from '@reduxjs/toolkit';
import fetchCities from './FetchCities'

const citiesListSlice = createSlice({
    name: 'suggestionsList',
    initialState: {
        suggestions: [],
        selectedOption: null,
    },
    reducers: {
        changeSelection: (state, action) => {
            if (action.payload === "UP" && state.selectedOption > 0) {
                return { ...state, selectedOption: state.selectedOption - 1}
            }
            else if (action.payload === "DOWN" && state.selectedOption < state.searchResults.length - 1) {
                return { ...state, selectedOption: state.selectedOption + 1 }
            }
        },
        clearSuggestions: (state, action) => ({...state, suggestions: []})
    },
    extraReducers: {
        [fetchCities.fulfilled]: (state, action) => ( {...state, suggestions: action.payload }),
        [fetchCities.rejected]: (state, action) => ({...state })
    }
})

export default citiesListSlice