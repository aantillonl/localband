import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateSpotifyPlaylistButton from './CreateSpotifyPlaylistButton';

function BandsList({ bandsList }) {
  return (
    <div>
      <ul className="bands-list">
        {bandsList.map(band => (
          <li key={band}>{band}</li>
        ))}
      </ul>
      {bandsList && bandsList.length > 0 ? <CreateSpotifyPlaylistButton /> : null}
    </div>
  );
}

BandsList.propTypes = {
  bandsList: PropTypes.arrayOf(PropTypes.string),
};
BandsList.defaultProps = { bandsList: [] };
const mapStateToProps = state => ({ bandsList: state.bandsList });

export default connect(mapStateToProps, null)(BandsList);
