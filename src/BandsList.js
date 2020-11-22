import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateSpotifyPlaylistButton from './CreateSpotifyPlaylistButon';

function BandsList({ bandsList }) {
  return (
    <div>
      <ul className="bands-list">
        {bandsList.map((band, i) => (
          <li key={`${band.name}_${i}`}>{band.name}</li>
        ))}
      </ul>
      {bandsList && bandsList.length > 0 ? <CreateSpotifyPlaylistButton /> : null}
    </div>
  );
}

BandsList.propTypes = {
  bandsList: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, song: PropTypes.string })),
};
BandsList.defaultProps = { bandsList: [] };
const mapStateToProps = state => ({ ...state.bandsList });

export default connect(mapStateToProps, null)(BandsList);
