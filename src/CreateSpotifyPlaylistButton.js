import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CreateSpotifyPlaylistThunk from './CreateSpotifyPlaylistThunk';
import createSpotifyPlaylistSlice from './CreateSpotifyPlaylistSlice';

function CreateSpotifyPlaylistButton({
  createPlaylistStatus,
  playlistId,
  CreateSpotifyPlaylistThunk,
  closeModal
}) {
  async function _onClick() {
    CreateSpotifyPlaylistThunk();
  }

  let modalMessage;
  if (createPlaylistStatus === 'FULFILLED') {
    modalMessage = (
      <span>
        Playlist created successfully.
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://open.spotify.com/user/spotify/playlist/${playlistId}`}>
          Open Playlist
        </a>
      </span>
    );
  }
  if (createPlaylistStatus === 'REJECTED')
    modalMessage = 'We could not create your playlist this time :(';
  if (createPlaylistStatus === 'PENDING') {
    modalMessage = (
      <span>
        Creating Spotify Playlist
        <br />
        <img src="/images/loading.gif" height="50" alt="Creating playlist" />
      </span>
    );
  }

  const showModal = createPlaylistStatus === 'DEFAULT' ? false : true;

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
      </div>
    </div>
  );
}

CreateSpotifyPlaylistButton.propTypes = {
  createPlaylistStatus: PropTypes.string.isRequired,
  playlistId: PropTypes.string
};
CreateSpotifyPlaylistButton.defaultProps = {
  playlistId: null
};
const mapStateToProps = state => ({
  ...state.createSpotifyPlaylist
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
