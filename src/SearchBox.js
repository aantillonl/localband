import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchBoxSlice from './searchBoxSlice';
import fetchCities from './FetchCities';
import SuggestionsList from './SuggestionList'
import suggestionsListSlice from './SuggestionsListSlice'

function SearchBox({
  searchString,
  hasSuggestions,
  setSearchString,
  preSearchTimeout,
  setPreSearchTimeout,
  fetchCities,
  clearSuggestions
}) {
  const updateSearchStringCallback = useCallback(()=>{
    if (preSearchTimeout) clearTimeout(preSearchTimeout)
    clearSuggestions()
    if (searchString && searchString.length > 3) {
      setPreSearchTimeout(setTimeout(fetchCities.bind(null, searchString), 1000))
    }
  }, [searchString, preSearchTimeout, setPreSearchTimeout, fetchCities, clearSuggestions])

  useEffect(updateSearchStringCallback, [searchString])
    
  return (
    <div className="searchbox">
      <label htmlFor="search_box">
        Find your local bands:
      </label>
      <br></br>
      <input
          id="search_box"
          type="text"
          autoComplete="off"
          value={searchString}
          onChange={event => setSearchString(event.target.value)}
          className={hasSuggestions?"has-suggestions":""}
        />
      <SuggestionsList/>
    </div>
  );
}

SearchBox.propTypes = {
  searchString: PropTypes.string,
  processSearchBoxOnChange: PropTypes.func
};
const mapStateToProps = (state) => ({...state.searchBox})

const mapDispatch = {
    setPreSearchTimeout: searchBoxSlice.actions.setPreSearchTimeout,
    setSearchString: searchBoxSlice.actions.setSearchString,
    fetchCities,
    clearSuggestions: suggestionsListSlice.actions.clearSuggestions
}
export default connect(mapStateToProps, mapDispatch)(SearchBox);
