import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchBoxSlice from './searchBoxSlice';
import fetchCities from './FetchCities';
import SuggestionsList from './SuggestionList';
import suggestionsListSlice from './SuggestionsListSlice';

function SearchBox({ searchString, setSearchString, fetchCities, fetchStatus }) {
  useEffect(() => {
    const promise = fetchCities(searchString);
    return () => {
      // Abort previous search. Doesnt affect if the promise already resolved
      promise.abort();
    };
  }, [fetchCities, searchString]);

  return (
    <div className="searchbox">
      <input
        className={fetchStatus === 'PENDING' ? 'loading' : ''}
        id="search_box"
        htmlFor="searchbox-label"
        type="text"
        autoComplete="off"
        value={searchString}
        onChange={event => setSearchString(event.target.value)}
        placeholder="Search for a city, e.g. New York"
      />
      <SuggestionsList />
    </div>
  );
}

SearchBox.propTypes = {
  searchString: PropTypes.string,
  setSearchString: PropTypes.func.isRequired,
  fetchCities: PropTypes.func.isRequired,
  fetchStatus: PropTypes.string.isRequired,
};

SearchBox.defaultProps = {
  searchString: '',
};

const mapStateToProps = state => ({ ...state.searchBox });

const mapDispatch = {
  ...searchBoxSlice.actions,
  clearSuggestions: suggestionsListSlice.actions.clearSuggestions,
  fetchCities,
};
export default connect(mapStateToProps, mapDispatch)(SearchBox);
