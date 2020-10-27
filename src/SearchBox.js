import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reactStringReplace from 'react-string-replace'
import searchBoxSlice from './searchBoxSlice';
import {fetchCities, fetchBands} from './searchBoxSlice';

function SearchBox({
  searchString,
  setSearchString,
  fetchCities,
  fetchStatus,
  searchResults,
  preSearchTimeout,
  setPreSearchTimeout,
  changeSelection,
  selectedOption,
  fetchBands,
  bandsList
}) {

  const onKeyDown = e => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      fetchBands()
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      changeSelection("UP")
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      changeSelection("DOWN")
    } 
  }
  
  let suggestions
  if (fetchStatus==='FINISHED') {
    if (searchResults.length > 0) {
      suggestions = <ul className="options">
        {searchResults.map((suggestion, index) => {
          return <li className={index === selectedOption ? "selected-option": null } key={index}>
            {reactStringReplace(suggestion.displayName, searchString, (match, i)=><span key={i} style={{fontWeight:"bold"}}>{match}</span>)}
          </li>
        })
        }
      </ul>
    }
    else {
      suggestions = <div>Sorry, no results...</div>
    }
  }

  let bandsUnsortedList = <ul>
    {bandsList.map((band, key) => <li key={key}>{band}</li>)}
  </ul>
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
          onChange={event => {
            setSearchString(event.target.value);
            clearTimeout(preSearchTimeout);
            setPreSearchTimeout(setTimeout(fetchCities, 1000));
          }}
          onKeyDown={onKeyDown}
          className={searchResults.length > 0? "with-suggestions": "no-suggestions"}
        />
      {suggestions}
      {bandsUnsortedList}
    </div>
  );
}

SearchBox.propTypes = {
  searchString: PropTypes.string,
  fetchStatus: PropTypes.string.isRequired,
  fetchCities: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  preSearchTimeout: PropTypes.number,
  selectedOption: PropTypes.number,
  bandsFromLocation: PropTypes.arrayOf(PropTypes.object)
};
const mapStateToProps = (state) => (
  {
    searchString: state.searchString,
    fetchStatus: state.fetchStatus,
    searchResults: state.searchResults,
    preSearchTimeout: state.preSearchTimeout,
    selectedOption: state.selectedOption,
    bandsList: state.bandsList
  }
)

const mapDispatch = {
  setSearchString: searchBoxSlice.actions.setSearchString,
  setPreSearchTimeout: searchBoxSlice.actions.setPreSearchTimeout,
  fetchCities,
  changeSelection: searchBoxSlice.actions.changeSelection,
  fetchBands
}
export default connect(mapStateToProps, mapDispatch)(SearchBox);
