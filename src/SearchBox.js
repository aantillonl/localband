import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import searchBoxSlice from './searchBoxSlice';

const { actions } = searchBoxSlice;
const { changeSearchString } = actions;

function SearchBox({ searchString, changeSearchString }) {
  return (
    <label htmlFor="search_box">
      Find your local bands:
      <input
        id="search_box"
        type="text"
        value={searchString}
        onChange={event => changeSearchString(event.target.value)}
      />
    </label>
  );
}

SearchBox.propTypes = {
  searchString: PropTypes.string.isRequired,
  changeSearchString: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ searchString: state.searchString });

export default connect(mapStateToProps, { changeSearchString })(SearchBox);
