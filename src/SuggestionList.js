import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reactStringReplace from 'react-string-replace';

function SuggestionList({ suggestions, selectedOption, searchString }) {
  if (suggestions && suggestions.length > 0) {
    return (
      <ul className="options">
        {suggestions.map((suggestion, index) => (
          <li
            className={index === selectedOption ? 'selected-option' : null}
            key={suggestion.displayName}>
            <a href={suggestion.uri}>
              {reactStringReplace(suggestion.displayName, searchString, match => (
                <span key={suggestion.displayName} style={{ fontWeight: 'bold' }}>
                  {match}
                </span>
              ))}
            </a>
          </li>
        ))}
      </ul>
    );
  } else {
    return <ul />;
  }
}

SuggestionList.prototype = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
      displayName: PropTypes.string,
    })
  ),
  selectedOption: PropTypes.number,
  changeSelection: PropTypes.func.isRequired,
  searchString: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  ...state.suggestionsList,
  searchString: state.searchBox.searchString,
});

export default connect(mapStateToProps, null)(SuggestionList);
