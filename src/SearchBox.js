import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchBoxSlice from './searchBoxSlice';
import fetchCities from './FetchCities';
import SuggestionsList from './SuggestionList';
import suggestionsListSlice from './SuggestionsListSlice';

function SearchBox({
  searchString,
  hasSuggestions,
  setSearchString,
  preSearchTimeout,
  setPreSearchTimeout,
  fetchCities,
  clearSuggestions,
  startSearch,
  changeSelection,
}) {
  const onKeyDown = e => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      return;
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      changeSelection('UP');
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      changeSelection('DOWN');
    }
  };

  const updateSearchStringCallback = useCallback(() => {
    if (preSearchTimeout) clearTimeout(preSearchTimeout);
    clearSuggestions();
    if (searchString && searchString.length > 3) {
      setPreSearchTimeout(
        setTimeout(() => {
          startSearch();
          fetchCities(searchString);
        }, 1000)
      );
    }
  }, [searchString, preSearchTimeout, setPreSearchTimeout, fetchCities, clearSuggestions]);

  useEffect(updateSearchStringCallback, [searchString]);

  return (
    <div className="searchbox">
      <label id="searchbox-label" htmlFor="search_box">
        Find your local bands:
        <input
          id="search_box"
          htmlFor="searchbox-label"
          type="text"
          autoComplete="off"
          value={searchString}
          onKeyDown={onKeyDown}
          onChange={event => setSearchString(event.target.value)}
          className={hasSuggestions ? 'has-suggestions' : ''}
        />
      </label>
      <SuggestionsList />
    </div>
  );
}

SearchBox.propTypes = {
  searchString: PropTypes.string,
  hasSuggestions: PropTypes.bool,
  setSearchString: PropTypes.func.isRequired,
  preSearchTimeout: PropTypes.number.isRequired,
  setPreSearchTimeout: PropTypes.func.isRequired,
  fetchCities: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  startSearch: PropTypes.func.isRequired,
  changeSelection: PropTypes.func.isRequired,
};

SearchBox.defaultProps = {
  searchString: '',
  hasSuggestions: false,
};

const mapStateToProps = state => ({ ...state.searchBox });

const mapDispatch = {
  ...searchBoxSlice.actions,
  clearSuggestions: suggestionsListSlice.actions.clearSuggestions,
  changeSelection: suggestionsListSlice.actions.changeSelection,
  fetchCities,
};
export default connect(mapStateToProps, mapDispatch)(SearchBox);
