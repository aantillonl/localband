import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CreateSpotifyPlaylistThunk from './CreateSpotifyPlaylistThunk';
import createSpotifyPlaylistSlice, {
  modalMessageSelector,
  showModalSelector
} from './CreateSpotifyPlaylistSlice';

function CreateSpotifyPlaylistButton({
  createPlaylistStatus,
  modalMessage,
  showModal,
  CreateSpotifyPlaylistThunk,
  closeModal
}) {
  async function _onClick() {
    CreateSpotifyPlaylistThunk();
  }

  return (
    <div>
      <button
        type="button"
        onClick={_onClick}
        disabled={createPlaylistStatus === 'PENDING'}
        className="create-playlist">
        Create Spotify Playlist
      </button>
      <div
        id="myModal"
        className="modal"
        style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-content">
          <span
            className="close"
            onClick={closeModal.bind(null, null)}
            onKeyDown={closeModal.bind(null, null)}
            role="button"
            tabIndex={0}>
            &times;
          </span>
          <p>{modalMessage}</p>
        </div>
        ;
      </div>
    </div>
  );
}

CreateSpotifyPlaylistButton.propTypes = {
  createPlaylistStatus: PropTypes.string.isRequired,
  modalMessage: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  ...state.createSpotifyPlaylist,
  modalMessage: modalMessageSelector(state.createSpotifyPlaylist),
  showModal: showModalSelector(state.createSpotifyPlaylist)
});
CreateSpotifyPlaylistButton.propTypes = {
  CreateSpotifyPlaylistThunk: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  closeModal: createSpotifyPlaylistSlice.actions.closeModal,
  CreateSpotifyPlaylistThunk
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSpotifyPlaylistButton);
