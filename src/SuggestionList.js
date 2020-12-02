import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reactStringReplace from 'react-string-replace';
import FetchBandNames from './FetchBandNames';
import CreateSpotifyPlaylistSlice from './CreateSpotifyPlaylistSlice';

function SuggestionList({ suggestions, searchString, FetchBandNames, setPlaylistName }) {
  function handleClick(hometownUri, hometownName, e) {
    e.preventDefault();
    setPlaylistName(`My Playlist From ${hometownName}`);
    FetchBandNames(hometownUri);
  }

  if (suggestions && suggestions.length > 0) {
    return (
      <ul className="options">
        {suggestions.map(suggestion => (
          <li key={suggestion.displayName}>
            <a
              className="suggestion"
              href={suggestion.uri}
              onClick={handleClick.bind(null, suggestion.uri, suggestion.displayName)}>
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
  searchString: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  ...state.suggestionsList,
  searchString: state.searchBox.searchString,
});

const mapDispatch = {
  FetchBandNames,
  setPlaylistName: CreateSpotifyPlaylistSlice.actions.setPlaylistName,
};

export default connect(mapStateToProps, mapDispatch)(SuggestionList);
