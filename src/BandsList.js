import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function BandsList({ bandsList }) {
  return (
    <ul>
      {bandsList.map(band => (
        <li key={band.name}>{band.name}</li>
      ))}
    </ul>
  );
}

BandsList.propTypes = {
  bandsList: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, song: PropTypes.string })),
};
BandsList.defaultProps = { bandsList: [] };
const mapStateToProps = state => ({ ...state.bandsList });

export default connect(mapStateToProps, null)(BandsList);
