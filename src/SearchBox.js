import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {fetchCities} from './searchBoxSlice';

function SearchBox({fetchStatus, searchResults, fetchCities }) {
  return (
    <div>
      <label htmlFor="search_box">
        Find your local bands:
        <input
          id="search_box"
          type="text"
          onChange={event => fetchCities(event.target.value)}
        />
      </label>
      <label>{fetchStatus}</label>
    </div>
  );
}

SearchBox.propTypes = {
  fetchStatus: PropTypes.string.isRequired,
  fetchCities: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object),
};
const mapStateToProps = (state) => (
  {
    fetchStatus: state.fetchStatus,
    searchResults: state.searchResults,
  }
)
export default connect(mapStateToProps, { fetchCities })(SearchBox);
