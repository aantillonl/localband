import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchBoxSlice from './searchBoxSlice';
import fetchCities from './FetchCities';
import SuggestionsList from './SuggestionList';
import suggestionsListSlice from './SuggestionsListSlice';

function SearchBox({ searchString, setSearchString, updateTextOnly, fetchCities, fetchStatus }) {
  useEffect(() => {
    const promise = fetchCities({ searchString, updateTextOnly });
    return () => {
      promise.abort();
    };
  }, [searchString, updateTextOnly, fetchCities]);

  return (
    <div className="searchbox">
      <input
        className={fetchStatus === 'PENDING' ? 'loading' : ''}
        id="search_box"
        htmlFor="searchbox-label"
        type="text"
        autoComplete="off"
        value={searchString}
        onChange={event =>
          setSearchString({
            searchString: event.target.value,
            updateTextOnly: false,
          })
        }
        placeholder="Search for a city, e.g. New York"
      />
      <SuggestionsList />
    </div>
  );
}

SearchBox.propTypes = {
  searchString: PropTypes.string,
  setSearchString: PropTypes.func.isRequired,
  updateTextOnly: PropTypes.bool.isRequired,
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
