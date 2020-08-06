import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchBoxSlice from './searchBoxSlice';
import {fetchCities} from './searchBoxSlice';

function SearchBox({
  fetchCities,
  fetchStatus,
  searchResults,
  preSearchTimeout,
  setPreSearchTimeout
}) {

  let suggestions
  if (fetchStatus==='FINISHED') {
    if (searchResults) {
      suggestions = <ul class="options">
        {searchResults.map((res) => <li key={res.key}><a href={res.link}>{res.name}</a></li>)}
      </ul>
    }
    else {
      suggestions = <div>Sorry, no results...</div>
    }
  }
  return (
    <div class="searchbox">
      <label htmlFor="search_box">
        Find your local bands:
      </label>
      <br></br>
      <input
          id="search_box"
          type="text"
          onChange={event => {
            clearTimeout(preSearchTimeout);
            setPreSearchTimeout(setTimeout(fetchCities.bind(this, event.target.value), 1000));
          }}
        />
      {suggestions}
    </div>
  );
}

SearchBox.propTypes = {
  searchString: PropTypes.string.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchCities: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  preSearchTimeout: PropTypes.number,
};
const mapStateToProps = (state) => (
  {
    searchString: state.searchString,
    fetchStatus: state.fetchStatus,
    searchResults: state.searchResults,
    preSearchTimeout: state.preSearchTimeout
  }
)

const mapDispatch = {
  setSearchString: searchBoxSlice.actions.setSearchString,
  setPreSearchTimeout: searchBoxSlice.actions.setPreSearchTimeout,
  fetchCities,
}
export default connect(mapStateToProps, mapDispatch)(SearchBox);
